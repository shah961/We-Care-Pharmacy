/**
 * WE CARE PHARMACY — ANIMATIONS & THREE.JS ENGINE
 * Handles lightweight GSAP reveals and conditional Three.js Hero visuals.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        initGSAPAnimations();
        initHeroThreeJS();
    }
});

/**
 * GSAP Scroll-Triggered & Entrance Animations
 */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Hero entrance reveal
    gsap.from('.hero-title', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.hero-description', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        delay: 0.2,
        ease: 'power2.out'
    });

    // Animate Cards on Scroll
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.card, .trust-card').forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                duration: 0.6,
                y: 20,
                opacity: 0,
                ease: 'power1.out'
            });
        });
    }
}

/**
 * Three.js Lightweight Healthcare Medical Visual
 * Automatically falls back gracefully if WebGL is unavailable or fails.
 */
function initHeroThreeJS() {
    const container = document.getElementById('webgl-container');
    const fallback = document.getElementById('hero-fallback');

    if (!container || typeof THREE === 'undefined') {
        if (fallback) fallback.style.display = 'block';
        return;
    }

    try {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Geometries — Low poly medical cross / abstract shape
        const group = new THREE.Group();

        const material = new THREE.MeshPhongMaterial({
            color: 0x00d2b5,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });

        const boxGeoVertical = new THREE.BoxGeometry(0.8, 2.4, 0.8);
        const boxGeoHorizontal = new THREE.BoxGeometry(2.4, 0.8, 0.8);

        const meshV = new THREE.Mesh(boxGeoVertical, material);
        const meshH = new THREE.Mesh(boxGeoHorizontal, material);

        group.add(meshV);
        group.add(meshH);
        scene.add(group);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00d2b5, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animation Loop
        let animationFrameId;
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            group.rotation.x += 0.005;
            group.rotation.y += 0.008;
            renderer.render(scene, camera);
        }

        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        // Hide fallback on successful render
        if (fallback) fallback.style.display = 'none';

    } catch (e) {
        console.warn('WebGL initialization fallback triggered:', e);
        if (fallback) fallback.style.display = 'block';
        if (container) container.style.display = 'none';
    }
}
