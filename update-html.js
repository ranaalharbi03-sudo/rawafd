const fs = require('fs');
const path = require('path');

const cartHTML = `
  <!-- ====== FLOATING CART ====== -->
  <div class="floating-cart" id="floatingCart" onclick="openCartModal()" style="display: none;">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
    <span class="cart-badge" id="cartBadge">0</span>
  </div>

  <!-- ====== CART MODAL ====== -->
  <div class="cart-modal-overlay" id="cartModal">
    <div class="cart-modal">
      <button class="modal-close" onclick="closeCartModal()">&times;</button>
      <h2>سلة الطلبات</h2>
      <div id="cartItemsContainer">
        <!-- Cart items will be injected here -->
      </div>
      <div class="cart-total-container">
        <span>الإجمالي:</span>
        <span class="cart-total" id="cartTotal">0 ر.س</span>
      </div>
      <button class="btn-submit-order" onclick="checkoutCart()" style="margin-top: 15px;">إتمام الطلب عبر واتساب</button>
    </div>
  </div>
`;

function processFile(filename, productType) {
    const filepath = path.join(__dirname, filename);
    let content = fs.readFileSync(filepath, 'utf8');

    // Replace size rows
    const brandCardRegex = /<div class="brand-card reveal">([\s\S]*?)<\/div>\s*<!--/g;

    content = content.replace(/<div class="brand-card(?: highlight-card)?(?: package-card)? reveal">([\s\S]*?)<button class="btn-order" onclick="openOrder\('([^']+)'\)">([^<]+)<\/button>\s*<\/div>/g, (match, cardInner, orderArg, btnText) => {

        // Extract brand name from h2
        let brandMatch = cardInner.match(/<h2>(.*?)<\/h2>/);
        let brand = brandMatch ? brandMatch[1].trim() : orderArg;

        // Replace size rows with selectable rows
        let newInner = cardInner.replace(/<div class="size-row"><span>(.*?)<\/span><span class="size-price">(.*?)<\/span><\/div>/g, (rowMatch, size, priceStr) => {
            // If price is not a number (e.g. "مجاناً" or "تواصل معنا"), we shouldn't show a checkbox, or value is 0
            let priceMatch = priceStr.match(/(\d+)/);
            if (!priceMatch) {
                return rowMatch; // keep as is if no numeric price
            }
            let price = priceMatch[1];

            return `
                        <label class="selectable-row">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" class="product-checkbox" data-product="${productType}" data-brand="${brand}" data-size="${size}" data-price="${price}">
                                <span>${size}</span>
                            </div>
                            <span class="size-price">${priceStr}</span>
                        </label>`;
        });

        return `<div class="brand-card ${match.includes('highlight-card') ? 'highlight-card' : ''} ${match.includes('package-card') ? 'package-card' : ''} reveal">${newInner}<button class="btn-add-to-cart-selected" onclick="addSelectedToCart(this)">أضف المختار للسلة</button>
                </div>`;
    });

    // Remove the old order modal from the page if it exists
    content = content.replace(/<!-- ====== ORDER MODAL ====== -->[\s\S]*?<script src="script.js"><\/script>/, cartHTML + '\n  <script src="script.js"></script>');

    fs.writeFileSync(filepath, content);
    console.log('Updated ' + filename);
}

processFile('bottles.html', 'مياه معبأة');
processFile('jugs.html', 'قوارير مياه كبيرة');
processFile('packages.html', 'باقات المساجد والمدارس');
