/*
 * Portfolio animation layer
 * Keeps motion lightweight, professional and accessible.
 */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const addMotionStyles = () => {
    if (document.getElementById('portfolio-motion-styles')) return;

    const style = document.createElement('style');
    style.id = 'portfolio-motion-styles';
    style.textContent = `
      @keyframes heroFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-7px); }
      }

      @keyframes softPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(0,87,255,.10); }
        50% { box-shadow: 0 0 0 12px rgba(0,87,255,0); }
      }

      @keyframes buttonShine {
        0% { transform: translateX(-120%); }
        100% { transform: translateX(220%); }
      }

      .portfolio-profile-motion {
        animation: heroFloat 5s ease-in-out infinite;
        will-change: transform;
      }

      .portfolio-profile-motion > div:first-child {
        animation: softPulse 3.5s ease-in-out infinite;
      }

      .cta-group .btn {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      .cta-group .btn::after {
        content: '';
        position: absolute;
        inset: 0 auto 0 -70%;
        width: 35%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
        transform: skewX(-18deg);
        pointer-events: none;
      }

      .cta-group .btn:hover::after {
        animation: buttonShine .7s ease forwards;
      }

      .skill-card,
      .education-card,
      .timeline-content,
      #projects .shadow-sm,
      #services .hover-lift {
        transform: translateZ(0);
        transition: transform .45s cubic-bezier(.2,.7,.2,1), box-shadow .45s ease;
      }

      .skill-card:hover,
      .education-card:hover,
      .timeline-content:hover,
      #projects .shadow-sm:hover,
      #services .hover-lift:hover {
        transform: translateY(-8px);
      }

      .timeline-icon {
        transition: transform .35s ease, box-shadow .35s ease;
      }

      .timeline-item:hover .timeline-icon {
        transform: scale(1.12) rotate(4deg);
        box-shadow: 0 0 0 7px rgba(0,87,255,.10);
      }

      .section-title .divider {
        transition: width .5s ease;
      }

      .section-title:hover .divider {
        width: 90px;
      }

      #back-to-top.active {
        animation: softPulse 2.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  };

  const setupProfileMotion = () => {
    const profileCard = document.querySelector('#about .col-lg-4 > div');
    if (profileCard) profileCard.classList.add('portfolio-profile-motion');
  };

  const setupRevealObserver = () => {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.skill-card, .education-card, .timeline-content, #projects .shadow-sm, #services .hover-lift'
    );

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    targets.forEach((el) => observer.observe(el));
  };

  const init = () => {
    addMotionStyles();
    setupProfileMotion();
    setupRevealObserver();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
