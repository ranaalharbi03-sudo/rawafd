/* ========================================
   SCRIPT — Luxury Water Brand Website
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Hero slow zoom on load ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add('loaded');
    });
  }

  /* ---------- Header scroll effect ---------- */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.main-nav ul');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Charity / Donation buttons ---------- */
  const donationButtons = document.querySelectorAll('.donation-btn');

  donationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      donationButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.toggle('selected');

      if (btn.classList.contains('selected')) {
        const note = document.querySelector('.charity-note');
        if (note) {
          note.textContent = `✓ تم اختيار: ${btn.textContent}. سيتم التنسيق معك عبر الواتساب.`;
          note.style.color = 'var(--clr-gold)';
          note.style.fontWeight = '500';
        }
      }
    });
  });

  /* ---------- Sticky CTA visibility ---------- */
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('hero');

  if (stickyCta && heroSection) {
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyCta.style.transform = 'translateY(0)';
        } else {
          stickyCta.style.transform = 'translateY(100%)';
        }
      });
    }, { threshold: 0.2 });

    stickyCta.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    stickyCta.style.transform = 'translateY(100%)';

    stickyObserver.observe(heroSection);
  }

  /* ---------- Parallax on source image ---------- */
  const sourceImage = document.querySelector('.source-image img');
  if (sourceImage) {
    window.addEventListener('scroll', () => {
      const rect = sourceImage.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.15;
        const offset = (window.innerHeight - rect.top) * speed;
        sourceImage.style.transform = `translateY(${-offset}px) scale(1.1)`;
      }
    }, { passive: true });
  }

  /* ---------- Product showcase parallax ---------- */
  const showcaseImage = document.querySelector('.product-showcase img');
  if (showcaseImage) {
    window.addEventListener('scroll', () => {
      const rect = showcaseImage.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.1;
        const offset = (window.innerHeight - rect.top) * speed;
        showcaseImage.style.transform = `translateY(${-offset}px)`;
      }
    }, { passive: true });
  }

});
