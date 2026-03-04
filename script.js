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

  /* ---------- Product Detail Modals ---------- */
  window.openProductModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeProductModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close product modal on overlay click
  document.querySelectorAll('.product-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  /* ---------- Order Modal ---------- */
  const orderModal = document.getElementById('orderModal');
  const modalClose = document.getElementById('modalClose');
  const orderForm = document.getElementById('orderForm');
  const orderProduct = document.getElementById('orderProduct');
  const qtyInput = document.getElementById('orderQty');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  // Open modal
  window.openOrder = function (productName) {
    if (orderModal) {
      orderModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (orderProduct && productName) {
        for (let opt of orderProduct.options) {
          if (opt.value === productName) {
            opt.selected = true;
            break;
          }
        }
      }
    }
  };

  // Close modal
  function closeModal() {
    if (orderModal) {
      orderModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeModal();
    });
  }

  // Quantity controls
  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
  }
  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value) || 1;
      if (val < 100) qtyInput.value = val + 1;
    });
  }

  // Form submit - send via WhatsApp
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const product = document.getElementById('orderProduct').value;
      const brand = document.getElementById('orderBrand').value;
      const qty = document.getElementById('orderQty').value;
      const name = document.getElementById('orderName').value;
      const phone = document.getElementById('orderPhone').value;
      const address = document.getElementById('orderAddress').value;
      const payment = document.querySelector('input[name="payment"]:checked').value;
      const notes = document.getElementById('orderNotes').value;

      let msg = `\u0637\u0644\u0628 \u062c\u062f\u064a\u062f \u0645\u0646 \u0631\u0648\u0627\u0641\u062f \u0627\u0644\u0623\u0646\u0647\u0627\u0631\n`;
      msg += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
      msg += `\u0627\u0644\u0645\u0646\u062a\u062c: ${product}\n`;
      msg += `\u0627\u0644\u0645\u0627\u0631\u0643\u0629: ${brand}\n`;
      msg += `\u0627\u0644\u0643\u0645\u064a\u0629: ${qty}\n`;
      msg += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
      msg += `\u0627\u0644\u0627\u0633\u0645: ${name}\n`;
      msg += `\u0627\u0644\u062c\u0648\u0627\u0644: ${phone}\n`;
      msg += `\u0627\u0644\u0639\u0646\u0648\u0627\u0646: ${address}\n`;
      msg += `\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639: ${payment}\n`;
      if (notes) msg += `\u0645\u0644\u0627\u062d\u0638\u0627\u062a: ${notes}\n`;

      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/966506939956?text=${encoded}`, '_blank');

      closeModal();
      orderForm.reset();
    });
  }

  /* ---------- Cart Logic ---------- */
  let cart = [];

  window.addSelectedToCart = function (btn) {
    const card = btn.closest('.brand-card');
    if (!card) return;

    const checkboxes = card.querySelectorAll('.product-checkbox:checked');
    if (checkboxes.length === 0) {
      alert('يرجى اختيار منتج واحد على الأقل لتتم إضافته للسلة.');
      return;
    }

    checkboxes.forEach(cb => {
      const product = cb.getAttribute('data-product');
      const brand = cb.getAttribute('data-brand');
      const size = cb.getAttribute('data-size');
      const price = parseFloat(cb.getAttribute('data-price')) || 0;

      // Check if item already in cart
      const existingItem = cart.find(item => item.product === product && item.brand === brand && item.size === size);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({
          product,
          brand,
          size,
          price,
          qty: 1
        });
      }

      // Uncheck it
      cb.checked = false;
    });

    updateCartUI();
    openCartModal(); // Show cart after adding
  };

  window.updateCartUI = function () {
    const badge = document.getElementById('cartBadge');
    const floatingCart = document.getElementById('floatingCart');
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');

    // Update badge and visibility
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) badge.innerText = totalQty;
    if (floatingCart) {
      floatingCart.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '<div class="empty-cart-msg">السلة فارغة</div>';
      if (totalEl) totalEl.innerText = '0 ر.س';
      return;
    }

    let html = '';
    let totalAmount = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      totalAmount += itemTotal;
      html += `
        <div class="cart-item">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.brand} - ${item.size}</div>
            <div class="cart-item-price">${item.price} ر.س x ${item.qty} = <strong>${itemTotal} ر.س</strong></div>
          </div>
          <div class="cart-item-actions">
            <button class="btn-remove-item" onclick="removeFromCart(${index})">حذف</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (totalEl) totalEl.innerText = totalAmount + ' ر.س';
  };

  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartUI();
    if (cart.length === 0) {
      closeCartModal();
    }
  };

  window.openCartModal = function () {
    const modal = document.getElementById('cartModal');
    if (modal) {
      updateCartUI();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCartModal = function () {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.checkoutCart = function () {
    if (cart.length === 0) return;

    let msg = `طلب جديد من سلة المشتريات (روافد الأنهار)\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;

    let totalAmount = 0;
    cart.forEach((item, index) => {
      msg += `${index + 1}. ${item.product} - ${item.brand}\n`;
      msg += `   الحجم: ${item.size} | الكمية: ${item.qty}\n`;
      if (item.price > 0) {
        msg += `   السعر: ${item.price * item.qty} ر.س\n`;
      }
      totalAmount += item.price * item.qty;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `الإجمالي: ${totalAmount} ر.س\n`;
    msg += `\nيرجى تزويدي بطريقة الدفع والعنوان، شكراً.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/966506939956?text=${encoded}`, '_blank');
  };

  // Close cart modal on overlay click
  const cartModalOverlay = document.getElementById('cartModal');
  if (cartModalOverlay) {
    cartModalOverlay.addEventListener('click', (e) => {
      if (e.target === cartModalOverlay) closeCartModal();
    });
  }

});
