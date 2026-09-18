/* ============================================
   ATUL KUMAR PORTFOLIO - MODERN INTERACTIONS
   Vanilla JavaScript, performance-first
   ============================================ */

'use strict';

const CONFIG = Object.freeze({
    THEME_STORAGE_KEY: 'portfolio-theme',
    SCROLL_THRESHOLD: 80,
    REVEAL_ROOT_MARGIN: '0px 0px -10% 0px'
});

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function throttle(fn, wait = 100) {
    let last = 0;
    let timer = null;
    return (...args) => {
        const now = Date.now();
        const remaining = wait - (now - last);
        if (remaining <= 0) {
            if (timer) clearTimeout(timer);
            timer = null;
            last = now;
            fn(...args);
        } else if (!timer) {
            timer = setTimeout(() => {
                last = Date.now();
                timer = null;
                fn(...args);
            }, remaining);
        }
    };
}

class ThemeManager {
    constructor() {
        this.root = document.documentElement;
        this.button = qs('#theme-toggle');
        this.init();
    }

    init() {
        const saved = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.apply(saved || (systemDark ? 'dark' : 'light'), false);

        this.button?.addEventListener('click', () => {
            const next = this.root.dataset.theme === 'dark' ? 'light' : 'dark';
            this.apply(next, true);
        });

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener?.('change', event => {
            if (!localStorage.getItem(CONFIG.THEME_STORAGE_KEY)) {
                this.apply(event.matches ? 'dark' : 'light', false);
            }
        });
    }

    apply(theme, persist = true) {
        const safeTheme = theme === 'dark' ? 'dark' : 'light';
        this.root.dataset.theme = safeTheme;
        if (persist) localStorage.setItem(CONFIG.THEME_STORAGE_KEY, safeTheme);
        this.button?.setAttribute('aria-pressed', String(safeTheme === 'dark'));
        this.button?.setAttribute('aria-label', safeTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

class NavigationManager {
    constructor() {
        this.navbar = qs('#navbar');
        this.links = qsa('.nav-link[data-section]');
        this.sections = qsa('main > section, #hero');
        this.init();
    }

    init() {
        this.links.forEach(link => link.addEventListener('click', event => this.navigate(event)));
        window.addEventListener('scroll', throttle(() => {
            this.updateNavbar();
            this.updateActiveLink();
        }, 80), { passive: true });
        this.updateNavbar();
        this.updateActiveLink();
    }

    navigate(event) {
        const link = event.currentTarget;
        const id = link.getAttribute('href');
        const target = id ? qs(id) : null;
        if (!target) return;

        event.preventDefault();
        const top = id === '#hero' ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 78);
        window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
        this.closeMobileMenu();
    }

    closeMobileMenu() {
        const collapse = qs('#navbarNav');
        const toggler = qs('.navbar-toggler');
        if (!collapse?.classList.contains('show')) return;
        if (window.bootstrap?.Collapse) {
            window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        } else {
            collapse.classList.remove('show');
            toggler?.setAttribute('aria-expanded', 'false');
        }
    }

    updateNavbar() {
        this.navbar?.classList.toggle('scrolled', window.scrollY > CONFIG.SCROLL_THRESHOLD);
    }

    updateActiveLink() {
        if (!this.sections.length) return;
        const marker = window.scrollY + 140;
        let current = this.sections[0].id;
        for (const section of this.sections) {
            if (section.offsetTop <= marker) current = section.id;
        }
        this.links.forEach(link => link.classList.toggle('active', link.dataset.section === current));
    }
}

class ScrollManager {
    constructor() {
        this.progress = qs('.scroll-progress');
        this.backTop = qs('#back-to-top');
        this.update = throttle(() => this.render(), 50);
        window.addEventListener('scroll', this.update, { passive: true });
        this.backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }));
        this.render();
    }

    render() {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const value = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
        if (this.progress) {
            this.progress.style.width = `${value}%`;
            this.progress.setAttribute('aria-valuenow', String(Math.round(value)));
        }
        this.backTop?.classList.toggle('show', window.scrollY > 500);
    }
}

class RevealManager {
    init() {
        const items = qsa('[data-reveal]');
        if (!items.length) return;
        if (reducedMotion() || !('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: CONFIG.REVEAL_ROOT_MARGIN, threshold: 0.08 });
        items.forEach((item, index) => {
            item.style.setProperty('--reveal-index', Math.min(index % 6, 5));
            observer.observe(item);
        });
    }
}

class CanvasBackground {
    constructor() {
        this.canvas = qs('#canvas-background');
        this.ctx = this.canvas?.getContext('2d', { alpha: true });
        this.particles = [];
        this.raf = 0;
        this.resize = throttle(() => this.setup(), 150);
        this.init();
    }

    init() {
        if (!this.canvas || !this.ctx || reducedMotion()) {
            if (this.canvas) this.canvas.hidden = true;
            return;
        }
        this.setup();
        window.addEventListener('resize', this.resize, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(this.raf);
            else if (!this.raf) this.animate();
        });
        this.animate();
    }

    setup() {
        const rect = this.canvas.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.canvas.width = Math.floor(this.width * dpr);
        this.canvas.height = Math.floor(this.height * dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(44, Math.max(18, Math.floor(this.width / 32)));
        this.particles = Array.from({ length: count }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            r: Math.random() * 1.4 + 0.4,
            a: Math.random() * 0.28 + 0.08
        }));
    }

    animate = () => {
        if (document.hidden) {
            this.raf = 0;
            return;
        }
        this.raf = requestAnimationFrame(this.animate);
        if (!this.width || !this.height) return;
        const dark = document.documentElement.dataset.theme === 'dark';
        const rgb = dark ? '100, 149, 255' : '0, 87, 255';
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -5) p.x = this.width + 5;
            if (p.x > this.width + 5) p.x = -5;
            if (p.y < -5) p.y = this.height + 5;
            if (p.y > this.height + 5) p.y = -5;
            this.ctx.fillStyle = `rgba(${rgb},${p.a})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            this.ctx.fill();
        }

        const maxDistance = 135;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const a = this.particles[i], b = this.particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.075;
                    this.ctx.strokeStyle = `rgba(${rgb},${opacity})`;
                    this.ctx.lineWidth = 0.6;
                    this.ctx.beginPath();
                    this.ctx.moveTo(a.x, a.y);
                    this.ctx.lineTo(b.x, b.y);
                    this.ctx.stroke();
                }
            }
        }
    };
}

class MicroInteractions {
    init() {
        this.initMagneticButtons();
        this.initTiltCards();
        this.initPointerGlow();
        this.initNavOutsideClick();
    }

    initMagneticButtons() {
        if (reducedMotion() || !window.matchMedia('(pointer:fine)').matches) return;
        qsa('.btn-primary, .contact-button').forEach(button => {
            button.addEventListener('pointermove', event => {
                const rect = button.getBoundingClientRect();
                const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
                const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
                button.style.setProperty('--mx', `${x}px`);
                button.style.setProperty('--my', `${y}px`);
            });
            button.addEventListener('pointerleave', () => {
                button.style.removeProperty('--mx');
                button.style.removeProperty('--my');
            });
        });
    }

    initTiltCards() {
        if (reducedMotion() || !window.matchMedia('(pointer:fine)').matches) return;
        qsa('.skill-card, .education-card, .service-card, .project-showcase').forEach(card => {
            card.addEventListener('pointermove', event => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.setProperty('--tilt-x', `${(-y * 2).toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${(x * 2).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.removeProperty('--tilt-x');
                card.style.removeProperty('--tilt-y');
            });
        });
    }

    initPointerGlow() {
        if (reducedMotion() || !window.matchMedia('(pointer:fine)').matches) return;
        const hero = qs('.hero-section');
        if (!hero) return;
        hero.addEventListener('pointermove', event => {
            const rect = hero.getBoundingClientRect();
            hero.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
            hero.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
        }, { passive: true });
    }

    initNavOutsideClick() {
        document.addEventListener('click', event => {
            const navbar = qs('#navbar');
            const collapse = qs('#navbarNav');
            if (!navbar || !collapse?.classList.contains('show') || navbar.contains(event.target)) return;
            if (window.bootstrap?.Collapse) window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        });
    }
}

class FooterManager {
    init() {
        const year = qs('#current-year');
        if (year) year.textContent = String(new Date().getFullYear());
    }
}

class AccessibilityManager {
    init() {
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                const collapse = qs('#navbarNav');
                if (collapse?.classList.contains('show') && window.bootstrap?.Collapse) {
                    window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new ScrollManager();
    const reveal = new RevealManager();
    reveal.init();
    new CanvasBackground();
    const interactions = new MicroInteractions();
    interactions.init();
    new FooterManager().init();
    new AccessibilityManager().init();
});
