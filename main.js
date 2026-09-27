/**
 * WE CARE PHARMACY — MAIN JAVASCRIPT ARCHITECTURE
 * Core Site Functionality, Accessible Navigation, Form UX, Global Config
 */

'use strict';

// Centrally Configured Verified Business Data
const WE_CARE_CONFIG = {
    businessName: "We Care Pharmacy",
    phone: "0321 3725000",
    telLink: "tel:03213725000",
    address: "Gate No. 1, Paragon City, Barki Road, Lahore, Punjab, Pakistan",
    // Unconfirmed WhatsApp placeholder — set to null/empty until owner verifies
    whatsappNumber: null 
};

document.addEventListener('DOMContentLoaded', () => {
    initDynamicYear();
    initMobileNavigation();
    initContactFormHandler();
});

/**
 * Automatically update current copyright year in footers
 */
function initDynamicYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Accessible Mobile Navigation Control
 * STRICT REQUIREMENT: Mobile menu MUST NOT open via swipe or edge drag.
 * Menu opens ONLY on explicit button click/tap.
 */
function initMobileNavigation() {
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const mobileOverlay = document.getElementById('mobile-nav-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggleBtn || !mobileOverlay) return;

    function openMenu() {
        mobileOverlay.classList.add('is-active');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        menuToggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeMenu() {
        mobileOverlay.classList.remove('is-active');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore body scroll
    }

    // Explicit Click Listeners
    menuToggleBtn.addEventListener('click', openMenu);

    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeMenu);
    }

    // Close when clicking any nav link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key press for keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('is-active')) {
            closeMenu();
        }
    });
}

/**
 * Client-Side Contact Form UX Handler
 * Safely informs user regarding submission endpoint
 */
function initContactFormHandler() {
    const contactForm = document.getElementById('contact-form');
    const feedbackMsg = document.getElementById('form-feedback');

    if (!contactForm || !feedbackMsg) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('user-name');
        const phoneInput = document.getElementById('user-phone');
        const messageInput = document.getElementById('user-message');

        if (!nameInput.value.trim() || !phoneInput.value.trim() || !messageInput.value.trim()) {
            feedbackMsg.className = 'form-feedback-message is-visible info';
            feedbackMsg.textContent = 'Please fill in all required fields.';
            return;
        }

        // Inform user clearly without pretending form sent to backend
        feedbackMsg.className = 'form-feedback-message is-visible info';
        feedbackMsg.innerHTML = `Thank you <strong>${escapeHtml(nameInput.value)}</strong>. Online web queries are currently set to preview mode. For immediate medicine verification, please call us directly at <strong><a href="${WE_CARE_CONFIG.telLink}">${WE_CARE_CONFIG.phone}</a></strong>.`;
        
        contactForm.reset();
    });
}

/**
 * Basic HTML sanitization for safe output
 */
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
