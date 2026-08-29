/**
 * Main JavaScript File
 * Handles UI interactions, theme switching, animations and navigation helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const LINKEDIN_URL = 'https://www.linkedin.com/in/atul7599';
    const htmlElement = document.documentElement;

    // Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
    htmlElement.setAttribute('data-theme', initialTheme);

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.classList.toggle('fa-moon', theme !== 'dark');
        themeIcon.classList.toggle('fa-sun', theme === 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    updateThemeIcon(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Sticky Navbar & Back to Top
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScroll = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTopBtn) backToTopBtn.classList.toggle('active', window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
                line_linked: { enable: true, distance: 160, color: '#0057FF', opacity: 0.07, width: 1 },
                move: { enable: true, speed: 1, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.18 } } }
            },
            retina_detect: true
        });
    }

    // Contact form fallback: no email backend is configured.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = 'Copy & Continue to LinkedIn <i class="fa-brands fa-linkedin ms-2"></i>';
        }

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            const getValue = (id) => document.getElementById(id)?.value.trim() || '';
            const contactMessage = [
                'Hello Atul,',
                '',
                `Name: ${getValue('name')}`,
                `Email: ${getValue('email')}`,
                `Subject: ${getValue('subject')}`,
                '',
                getValue('message')
            ].join('\n');

            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(contactMessage);
                }
            } catch (error) {
                // Clipboard access can be denied by the browser; navigation still works.
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
});
