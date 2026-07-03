/**
 * Main JavaScript File
 * Handles UI interactions, library initializations, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================================================
    // Dynamic Year in Footer
    // ==========================================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // Dark Mode Toggle
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // ==========================================================================
    // Sticky Navbar & Back to Top Button on Scroll
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('active', window.scrollY > 300);
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // Library Initializations
    // ==========================================================================

    // 1. Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }

    // 2. Initialize Typed.js
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'Accounting.',
                'GST & Taxation.',
                'Bookkeeping.',
                'ERP Software Management.',
                'Corporate Finance.'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }

    // 3. Initialize Particles.js (Lightweight Configuration)
    const particlesElement = document.getElementById('particles-js');
    if (particlesElement && typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: '#0057FF' },
                shape: { type: 'circle' },
                opacity: { value: 0.2, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#0057FF',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
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
                    grab: { distance: 140, line_linked: { opacity: 0.3 } }
                }
            },
            retina_detect: true
        });
    }

    // ==========================================================================
    // Number Counter Animation via Intersection Observer
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is faster

    const startCounting = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (target > 10 ? '+' : ''); // Add '+' for higher numbers
            }
        };
        updateCount();
    };

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting(entry.target);
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } else {
        // Fallback for older browsers
        counters.forEach(counter => startCounting(counter));
    }
});

// Production enhancements
(() => {
  const printResume = document.getElementById('print-resume');
  if (printResume) {
    printResume.addEventListener('click', (event) => {
      event.preventDefault();
      window.print();
    });
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('navbarNav');
      if (nav && nav.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((item) => {
        item.classList.toggle('active', item === btn);
        item.classList.toggle('btn-primary', item === btn);
        item.classList.toggle('btn-outline-primary', item !== btn);
      });
      const filterValue = btn.dataset.filter;
      portfolioItems.forEach((item) => {
        item.hidden = !(filterValue === 'all' || item.classList.contains(filterValue));
      });
    });
  });
})();
