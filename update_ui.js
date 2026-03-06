const fs = require('fs');

function updateBottles() {
    let content = fs.readFileSync('bottles.html', 'utf8');

    // The data mapping
    const catalog = {
        "أروى": { price: 15, tag: '<span class="discount-badge">الأكثر طلباً</span>' },
        "نوفا": { price: 12, tag: '' },
        "حياة": { price: 14, tag: '' },
        "بيرين": { price: 13, tag: '' },
        "صفا": { price: 11, tag: '' },
        "القصيم": { price: 10, tag: '' },
        "هنا": { price: 11, tag: '' },
        "تانيا": { price: 12, tag: '' }
    };

    for (const [brand, data] of Object.entries(catalog)) {
        // Find the block starting from <!-- brand --> to the next <!-- or </div></div>
        const regex = new RegExp(`<!-- ${brand} -->[\\s\\S]*?<button class="btn-add-to-cart-selected"[\\s\\S]*?</div>`, 'g');

        let fileBrand = '';
        if (brand === 'أروى') fileBrand = 'arwa';
        else if (brand === 'نوفا') fileBrand = 'nova';
        else if (brand === 'حياة') fileBrand = 'hayat';
        else if (brand === 'بيرين') fileBrand = 'berain';
        else if (brand === 'صفا') fileBrand = 'safa';
        else if (brand === 'القصيم') fileBrand = 'qassim';
        else if (brand === 'هنا') fileBrand = 'hana';
        else if (brand === 'تانيا') fileBrand = 'tania';

        const replacement = `<!-- ${brand} -->
                <a href="product.html?type=bottles&brand=${brand}" class="brand-card clean-card catalog-link reveal">
                    <div class="brand-card-img">
                        <img src="assets/${fileBrand}.png" alt="${brand}">
                        ${data.tag}
                    </div>
                    <div class="brand-card-body">
                        <h3 class="brand-title">مياه ${brand}</h3>
                        <p class="brand-desc">مياه شرب معبأة نقية ومنعشة</p>
                        <span class="brand-price-start">يبدأ من ${data.price} ر.س</span>
                    </div>
                </a>`;

        content = content.replace(regex, replacement);
    }
    fs.writeFileSync('bottles.html', content);
}

function updateJugs() {
    let content = fs.readFileSync('jugs.html', 'utf8');
    const catalog = {
        "نوفا": { price: 8, file: 'nova' },
        "القصيم": { price: 7, file: 'qassim' },
        "هنا": { price: 7, file: 'hana' },
        "تانيا": { price: 8, file: 'tania' }
    };
    for (const [brand, data] of Object.entries(catalog)) {
        const regex = new RegExp(`<!-- ${brand} -->[\\s\\S]*?<button class="btn-add-to-cart-selected"[\\s\\S]*?</div>`, 'g');
        const replacement = `<!-- ${brand} -->
                <a href="product.html?type=jugs&brand=${brand}" class="brand-card clean-card catalog-link reveal">
                    <div class="brand-card-img">
                        <img src="assets/${data.file}.png" alt="${brand}">
                    </div>
                    <div class="brand-card-body">
                        <h3 class="brand-title">قارورة ${brand} 5 جالون</h3>
                        <p class="brand-desc">استبدال مع خدمة توصيل مجانية</p>
                        <span class="brand-price-start">${data.price} ر.س</span>
                    </div>
                </a>`;
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync('jugs.html', content);
}

function updatePackages() {
    let content = fs.readFileSync('packages.html', 'utf8');
    const catalog = {
        "باقة يومية": { key: "يومية", file: 'nova' },
        "باقة أسبوعية": { key: "أسبوعية", file: 'arwa' },
        "باقة شهرية": { key: "شهرية", file: 'berain' }
    };
    for (const [brand, data] of Object.entries(catalog)) {
        const regex = new RegExp(`<!-- ${brand} -->[\\s\\S]*?<button class="btn-order"[\\s\\S]*?</div>`, 'g');
        const replacement = `<!-- ${brand} -->
                <a href="product.html?type=packages&brand=${data.key}" class="brand-card clean-card catalog-link reveal">
                    <div class="brand-card-img">
                        <img src="assets/${data.file}.png" alt="${brand}">
                    </div>
                    <div class="brand-card-body">
                        <h3 class="brand-title">${brand}</h3>
                        <p class="brand-desc">عروض وتخفيضات المساجد والمدارس</p>
                        <span class="brand-price-start">عرض خاص</span>
                    </div>
                </a>`;
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync('packages.html', content);
}

updateBottles();
updateJugs();
updatePackages();
console.log("Done");
