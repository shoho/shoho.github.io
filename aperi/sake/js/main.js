/**
 * Aperi - Static HTML JavaScript
 * Converted from Vue + Vuetify
 */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Sticky Header on Scroll
  // --------------------------------------------------------------------------
  function initStickyHeader() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    updateHeader();
  }

  // --------------------------------------------------------------------------
  // Mobile Drawer Menu
  // --------------------------------------------------------------------------
  function initMobileDrawer() {
    const menuBtn = document.querySelector('.menu-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const closeBtn = document.querySelector('.drawer-close');
    const navItems = document.querySelectorAll('.drawer-nav-item');

    if (!menuBtn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    // Close drawer when clicking nav items
    navItems.forEach(function(item) {
      item.addEventListener('click', closeDrawer);
    });

    // Close drawer on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // FAQ Accordion
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const panels = document.querySelectorAll('.faq-panel');

    if (!panels.length) return;

    panels.forEach(function(panel) {
      const question = panel.querySelector('.faq-question');

      if (!question) return;

      question.addEventListener('click', function() {
        const isOpen = panel.classList.contains('open');

        // Close all panels (accordion behavior)
        panels.forEach(function(p) {
          p.classList.remove('open');
        });

        // Open clicked panel if it wasn't open
        if (!isOpen) {
          panel.classList.add('open');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll for Anchor Links
  // --------------------------------------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();

          const headerHeight = 64; // Header height
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Initialize on DOM Ready
  // --------------------------------------------------------------------------
  function init() {
    initStickyHeader();
    initMobileDrawer();
    initFaqAccordion();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
