/**
 * Main JavaScript File
 * Handles UI interactions, library initializations, animations and contact workflow.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const LINKEDIN_URL = 'https://www.linkedin.com/in/atul7599';

    // Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.classList.toggle('fa-moon', theme !== 'dark');
        themeIcon.classList.toggle('fa-sun', theme === 'dark');
    }

    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Sticky Navbar & Back to Top
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTopBtn) backToTopBtn.classList.toggle('active', window.scrollY > 300);
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }

    // Particles.js — kept subtle for the hero background
    const particlesElement = document.getElementById('particles-js');
    if (particlesElement && typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 24, density: { enable: true, value_area: 900 } },
                color: { value: '#0057FF' },
                shape: { type: 'circle' },
                opacity: { value: 0.16, random: false },
                size: { value: 2.5, random: true },
                line_linked: {
                    enable: true,
                    distance: 160,
                    color: '#0057FF',
                    opacity: 0.07,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: false },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.18 } }
                }
            },
            retina_detect: true
        });
    }

    // Contact form: there is no backend endpoint configured, so do not pretend
    // the form sends email. Instead, copy the message and open LinkedIn.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const subject = document.getElementById('subject')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            const contactMessage = [
                `Hello Atul,`,
                ``,
                `Name: ${name}`,
                `Email: ${email}`,
                `Subject: ${subject}`,
                ``,
                message
            ].join('\n');

            try {
                await navigator.clipboard.writeText(contactMessage);
            } catch (error) {
                // Clipboard can be blocked by browser permissions; opening LinkedIn
                // still gives the visitor a working contact path.
            }

            let status = document.getElementById('contact-status');
            if (!status) {
                status = document.createElement('div');
                status.id = 'contact-status';
                status.className = 'alert alert-success mt-3 mb-0';
                contactForm.appendChild(status);
            }
            status.textContent = 'Your message has been copied. LinkedIn will open so you can send it to Atul.';

            window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer');
        });
    }

    // Close mobile navbar after navigation
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('navbarNav');
            if (nav && nav.classList.contains('show') && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
            }
        });
    });

    // Generic form validation for any additional forms
    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', () => {
            form.classList.add('was-validated');
        }, { capture: true });
    });
});
