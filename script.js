/* ========================================
   SCRIPT — Luxury Water Brand Website
   ======================================== */

// Supabase Configuration
const SUPABASE_URL = 'https://dceieamoqgemqoerpuzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZWllYW1vcWdlbXFvZXJwdXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDY3ODEsImV4cCI6MjA4ODMyMjc4MX0.OyzeztND2iCW-nkPVLW5HeXwQ183_2dt-7pT-7Hcx2k';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let cart = JSON.parse(localStorage.getItem('waterCart')) || [];
function saveCart() {
  localStorage.setItem('waterCart', JSON.stringify(cart));
}

const waterCatalog = {
  bottles: {
    category: "مياه معبأة",
    "أروى": {
      name: "أروى",
      desc: "مياه شرب نقية منعشة، معبأة بأعلى معايير الجودة لتمنحك الترطيب المثالي الذي يحتاجه جسمك في كل يوم. خيارك الأمثل لصفاء الذهن وحيوية الجسد.",
      img: "assets/arwa.png",
      sizes: [
        { size: "200 مل (كرتون)", price: 15 },
        { size: "330 مل (كرتون)", price: 18 },
        { size: "600 مل (كرتون)", price: 20 },
        { size: "1.5 لتر (كرتون)", price: 22 }
      ]
    },
    "نوفا": {
      name: "نوفا",
      desc: "مستخرجة من أنقى الآبار الجوفية، مياه نوفا تقدم لك توازناً مثالياً في المعادن لتمنحك طعماً طبيعياً منعشاً يروي عطشك ويجدد طاقتك.",
      img: "assets/nova.png",
      sizes: [
        { size: "200 مل (كرتون)", price: 12 },
        { size: "330 مل (كرتون)", price: 15 },
        { size: "600 مل (كرتون)", price: 17 },
        { size: "1.5 لتر (كرتون)", price: 20 }
      ]
    },
    "بيرين": {
      name: "بيرين",
      desc: "مياه بيرين تمنحك تجربة ارتواء استثنائية، فهي مصممة خصيصاً لتواكب نمط حياتك الصحي بتركيبة غنية ومتوازنة وخفيفة على المعدة.",
      img: "assets/berain.png",
      sizes: [
        { size: "200 مل (كرتون)", price: 13 },
        { size: "330 مل (كرتون)", price: 15 },
        { size: "600 مل (كرتون)", price: 18 },
        { size: "1.5 لتر (كرتون)", price: 20 }
      ]
    },
    "القصيم": {
      name: "القصيم",
      desc: "من قلب الطبيعة إلى مائدتك، مياه القصيم تقدم لك الطعم الأصيل والمنعش بفضل تركيبتها الطبيعية المنخفضة بالصوديوم للحفاظ على صحتك طوال اليوم.",
      img: "assets/qassim.png",
      sizes: [
        { size: "200 مل (كرتون)", price: 10 },
        { size: "330 مل (كرتون)", price: 13 },
        { size: "600 مل (كرتون)", price: 15 },
        { size: "1.5 لتر (كرتون)", price: 18 }
      ]
    },
    "حياة": {
      name: "حياة", desc: "نقاء متوازن لك ولعائلتك.", img: "assets/hayat.png",
      sizes: [{ size: "200 مل (كرتون)", price: 14 }, { size: "330 مل (كرتون)", price: 16 }, { size: "600 مل (كرتون)", price: 19 }, { size: "1.5 لتر (كرتون)", price: 21 }]
    },
    "صفا": {
      name: "صفا", desc: "خيارك اليومي لمياه عذبة ونقية.", img: "assets/safa.png",
      sizes: [{ size: "200 مل (كرتون)", price: 11 }, { size: "330 مل (كرتون)", price: 14 }, { size: "600 مل (كرتون)", price: 16 }, { size: "1.5 لتر (كرتون)", price: 19 }]
    },
    "هنا": {
      name: "هنا", desc: "مياه طبيعية تروي العطش في أي وقت.", img: "assets/hana.png",
      sizes: [{ size: "200 مل (كرتون)", price: 11 }, { size: "330 مل (كرتون)", price: 14 }, { size: "600 مل (كرتون)", price: 16 }, { size: "1.5 لتر (كرتون)", price: 19 }]
    },
    "تانيا": {
      name: "تانيا", desc: "جودة متناهية لتوازن لا يُضاهى.", img: "assets/tania.png",
      sizes: [{ size: "200 مل (كرتون)", price: 12 }, { size: "330 مل (كرتون)", price: 14 }, { size: "600 مل (كرتون)", price: 17 }, { size: "1.5 لتر (كرتون)", price: 20 }]
    }
  },
  jugs: {
    category: "قوارير مياه كبيرة",
    "نوفا": { name: "نوفا", desc: "مياه نوفا 5 جالون للمبردات المنزلية والمكتبية بخدمة توصيل مجانية.", img: "assets/nova.png", sizes: [{ size: "قارورة 5 جالون", price: 8 }] },
    "القصيم": { name: "القصيم", desc: "قارورة القصيم 5 جالون للصحة والنقاء طوال الأسبوع.", img: "assets/qassim.png", sizes: [{ size: "قارورة 5 جالون", price: 7 }] },
    "هنا": { name: "هنا", desc: "عبوة التوفير للمنازل والشركات من مياه هنا.", img: "assets/hana.png", sizes: [{ size: "قارورة 5 جالون", price: 7 }] },
    "تانيا": { name: "تانيا", desc: "قارورة 5 جالون عملية وموفرة من تانيا.", img: "assets/tania.png", sizes: [{ size: "قارورة 5 جالون", price: 8 }] }
  },
  packages: {
    category: "باقات المساجد والمدارس",
    "يومية": { name: "باقة يومية", desc: "توصيل يومي منتظم للمساجد والمدارس حسب الكمية المطلوبة. السعر محدد بالكرتون الواحد (حسب الكميات).", img: "assets/nova.png", sizes: [{ size: "25 كرتون (الحد الأدنى)", price: 300 }, { size: "50 كرتون (توصيل يومي)", price: 580 }] },
    "أسبوعية": { name: "باقة أسبوعية", desc: "توصيل مرة كل أسبوع بأسعار مخفضة مع إمكانية تعديل الكمية وإلغاء متى شئت.", img: "assets/arwa.png", sizes: [{ size: "اشتراك أسبوعي - 50 كرتون", price: 550 }, { size: "اشتراك أسبوعي - 100 كرتون", price: 1000 }] },
    "شهرية": { name: "باقة شهرية", desc: "باقة الأوفر! 4 توصيلات شهرياً مع أولوية في التوصيل وتوثيق بالصور.", img: "assets/berain.png", sizes: [{ size: "اشتراك شهري مخفض (100 كرتون مقسمة)", price: 900 }, { size: "اشتراك شهري كبير (200 كرتون مقسمة)", price: 1700 }] }
  }
};

window.initProductDetailPage = function () {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const brandParam = params.get('brand');

  if (!type || !brandParam || !waterCatalog[type] || !waterCatalog[type][brandParam]) {
    console.error("Invalid product parameters.");
    return;
  }

  const category = waterCatalog[type].category;
  const productData = waterCatalog[type][brandParam];
  let selectedSizeIndex = 0;

  // Set Breadcrumbs
  const bcCat = document.getElementById('bc-category');
  if (bcCat) bcCat.innerText = category;
  const bcBrand = document.getElementById('bc-brand');
  if (bcBrand) bcBrand.innerText = productData.name;

  // Set Texts & Image
  const dTitle = document.getElementById('detail-title');
  if (dTitle) dTitle.innerText = "مياه " + productData.name;

  const badge = document.getElementById('detail-brand-badge');
  if (badge) badge.innerText = productData.name;

  const dImg = document.getElementById('detail-img');
  if (dImg) dImg.src = productData.img;

  // Update Thumbs
  for (let i = 1; i <= 4; i++) {
    const thumb = document.getElementById(`thumb${i}`);
    if (thumb) thumb.src = productData.img;
  }

  // Thumbnail click logic
  document.querySelectorAll('.thumb').forEach(thumbBox => {
    thumbBox.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumbBox.classList.add('active');
    });
  });

  // Populate Sizes Buttons
  const sizeContainer = document.getElementById('size-buttons-container');
  const priceEl = document.getElementById('detail-price');
  if (sizeContainer && priceEl) {
    sizeContainer.innerHTML = "";
    productData.sizes.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = `size-btn-item ${i === 0 ? 'selected' : ''}`;
      btn.innerText = s.size;
      btn.onclick = () => {
        // Update selection
        document.querySelectorAll('.size-btn-item').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSizeIndex = i;
        // Update price
        priceEl.innerText = productData.sizes[selectedSizeIndex].price;
      };
      sizeContainer.appendChild(btn);
    });
    // Init price
    priceEl.innerText = productData.sizes[0].price;
  }

  // Quantity controls
  const qtyInput = document.getElementById('detailQty');
  const btnMinus = document.getElementById('detailQtyMinus');
  const btnPlus = document.getElementById('detailQtyPlus');

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
  }
  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value) || 1;
      if (val < 100) qtyInput.value = val + 1;
    });
  }

  // Add to Cart / Buy Now
  const btnBuy = document.getElementById('btnBuyNow');
  if (btnBuy) {
    btnBuy.addEventListener('click', () => {
      const sizeObj = productData.sizes[selectedSizeIndex];
      const qty = parseInt(qtyInput.value) || 1;

      const existingItem = cart.find(item => item.product === category && item.brand === productData.name && item.size === sizeObj.size);

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.push({
          product: category,
          brand: productData.name,
          size: sizeObj.size,
          price: sizeObj.price,
          qty: qty
        });
      }

      saveCart();
      updateCartUI();
      openCartModal(); // Show cart modal allowing them to checkout
    });
  }

  // Accordions
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const parent = btn.parentElement;
      if (parent.classList.contains('active')) {
        parent.classList.remove('active');
        content.style.display = 'none';
        btn.querySelector('.icon').innerText = '+';
      } else {
        parent.classList.add('active');
        content.style.display = 'block';
        btn.querySelector('.icon').innerText = '-';
      }
    });
  });
}; document.addEventListener('DOMContentLoaded', () => {

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

    saveCart();
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
    saveCart();
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
    window.location.href = 'checkout.html';
  };

  /* ---------- Checkout Page Logic ---------- */
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  if (checkoutItemsList) {
    renderCheckoutItems();

    function renderCheckoutItems() {
      let html = '';
      let subtotal = 0;

      if (cart.length === 0) {
        checkoutItemsList.innerHTML = '<p style="color: var(--color-gray); padding: 10px 0;">السلة فارغة. يرجى إضافة منتجات أولاً.</p>';
        document.getElementById('checkoutSubtotal').innerText = '0 ر.س';
        document.getElementById('checkoutGrandTotal').innerText = '0 ر.س';
        return;
      }

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        html += `
          <div class="checkout-item">
            <div class="checkout-item-info">
              <div class="checkout-item-title">${item.brand} - ${item.size}</div>
              <div class="checkout-item-meta">${item.price} ر.س للقطعة</div>
              <div class="checkout-item-controls">
                <button type="button" class="checkout-qty-btn" onclick="updateCheckoutQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button type="button" class="checkout-qty-btn" onclick="updateCheckoutQty(${index}, 1)">+</button>
                <button type="button" class="remove-item-btn" onclick="removeCheckoutItem(${index})">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="checkout-item-price">${itemTotal} ر.س</div>
          </div>
        `;
      });

      checkoutItemsList.innerHTML = html;
      document.getElementById('checkoutSubtotal').innerText = subtotal + ' ر.س';
      document.getElementById('checkoutGrandTotal').innerText = subtotal + ' ر.س'; // free delivery
    }

    window.updateCheckoutQty = function (index, delta) {
      if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty < 1) cart[index].qty = 1;
        saveCart();
        updateCartUI(); // Updates the floating cart badge too
        renderCheckoutItems();
      }
    };

    window.removeCheckoutItem = function (index) {
      if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
        renderCheckoutItems();
      }
    };

    // Handle Form Submit
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('السلة فارغة، لا يمكن إتمام الطلب.');
        return;
      }

      // Collect data
      const name = document.getElementById('checkoutName').value;
      const phone = document.getElementById('checkoutPhone').value;
      const city = document.getElementById('checkoutCity').value;
      const address = document.getElementById('checkoutAddress').value;
      const deliveryTime = document.querySelector('input[name="deliveryTime"]:checked').value;
      const payment = document.querySelector('input[name="checkoutPayment"]:checked').value;
      const notes = document.getElementById('checkoutNotes').value;

      let totalAmount = 0;
      cart.forEach((item) => {
        totalAmount += item.price * item.qty;
      });

      const submitBtn = document.querySelector('.checkout-btn-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'جاري تسجيل الطلب... <span class="loader"></span>';
      submitBtn.disabled = true;

      // 1. Save to Supabase DB (ensure supabase is loaded)
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .insert([
              {
                customer_name: name,
                customer_phone: phone,
                city: city,
                address: address,
                delivery_time: deliveryTime,
                payment_method: payment,
                notes: notes,
                total_amount: totalAmount,
                items: cart
              }
            ]);

          if (error) {
            console.error('Error saving order to Supabase:', error);
          } else {
            console.log('Order successfully saved to Supabase');
          }
        } catch (err) {
          console.error('Unexpected error inserting into Supabase:', err);
        }
      }

      // 2. Prepare WhatsApp Confirmation Message
      let msg = `🛒 طلب إلكتروني من موقع (روافد الأنهار)\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `🔹 تفاصيل العميل:\n`;
      msg += `الاسم: ${name}\n`;
      msg += `الجوال: ${phone}\n`;
      msg += `\n📍 التوصيل:\n`;
      msg += `المدينة/الحي: ${city}\n`;
      msg += `العنوان: ${address}\n`;
      msg += `الوقت المفضل: ${deliveryTime}\n`;
      msg += `\n💳 معلومات الدفع:\n`;
      msg += `طريقة الدفع: ${payment}\n`;
      if (notes) msg += `ملاحظات: ${notes}\n`;

      msg += `\n📦 المنتجات المطلوبة:\n`;
      cart.forEach((item, index) => {
        msg += `${index + 1}. ${item.product} - ${item.brand} (${item.size})\n`;
        msg += `   الكمية: ${item.qty} | السعر: ${item.price * item.qty} ر.س\n`;
      });

      msg += `━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `الإجمالي الكلي: ${totalAmount} ر.س\n`;
      msg += `\nالرجاء تأكيد الطلب. شكراً لكم!`;

      // Redirect to WhatsApp
      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/966506939956?text=${encoded}`, '_blank');

      // Clear Cart
      cart = [];
      saveCart();
      updateCartUI();
      renderCheckoutItems();

      alert('تم استلام طلبك بنجاح وتسجيله في النظام! سيتم تحويلك للواتساب لإرسال رسالة التأكيد للمندوب.');

      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      window.location.href = 'index.html';
    });
  }

  // Close cart modal on overlay click
  const cartModalOverlay = document.getElementById('cartModal');
  if (cartModalOverlay) {
    cartModalOverlay.addEventListener('click', (e) => {
      if (e.target === cartModalOverlay) closeCartModal();
    });
  }

});
