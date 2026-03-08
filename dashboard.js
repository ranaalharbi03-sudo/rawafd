/* ========================================
   DASHBOARD LOGIC
   ======================================== */

// 1. Supabase Init (Re-using the same URL and ANON key from script.js)
const SUPABASE_URL = 'https://dceieamoqgemqoerpuzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZWllYW1vcWdlbXFvZXJwdXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDY3ODEsImV4cCI6MjA4ODMyMjc4MX0.OyzeztND2iCW-nkPVLW5HeXwQ183_2dt-7pT-7Hcx2k';

const dbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Global state
let currentOrders = [];
let selectedOrderId = null;

// 2. Authentication Logic
document.addEventListener('DOMContentLoaded', async () => {
    if (!dbClient) {
        alert('حدث خطأ في تحميل مكتبة قاعدة البيانات');
        return;
    }

    // Check login state on load
    const { data: { session } } = await dbClient.auth.getSession();

    const loginScreen = document.getElementById('loginScreen');
    const dashboardWrapper = document.getElementById('dashboardWrapper');

    if (session) {
        // User is logged in
        loginScreen.style.display = 'none';
        dashboardWrapper.style.display = 'flex';
        fetchOrders();
    } else {
        // User needs to login wrapper is already display:none, login is flex
    }

    // Handle Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const btn = document.getElementById('loginBtn');
            const errBox = document.getElementById('loginError');

            btn.innerText = 'جاري التحقق...';
            btn.disabled = true;
            errBox.innerText = '';

            try {
                const { data, error } = await dbClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    errBox.innerText = 'بيانات الدخول غير صحيحة';
                    btn.innerText = 'دخول';
                    btn.disabled = false;
                } else {
                    // Success
                    loginScreen.style.display = 'none';
                    dashboardWrapper.style.display = 'flex';
                    fetchOrders();
                }
            } catch (err) {
                errBox.innerText = 'حدث خطأ في الاتصال';
                btn.innerText = 'دخول';
                btn.disabled = false;
            }
        });
    }

    // Handle Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await dbClient.auth.signOut();
            window.location.reload();
        });
    }

    // Handle Filter Change
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            renderOrdersTable(currentOrders);
        });
    }

    // Handle Modal Status Update
    const btnUpdateStatus = document.getElementById('btnUpdateStatus');
    if (btnUpdateStatus) {
        btnUpdateStatus.addEventListener('click', updateOrderStatus);
    }
});


// 3. Data Fetching and Updating UI
window.fetchOrders = async function () {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="loading-state">جاري تحميل البيانات... ⏳</td></tr>';

    try {
        const { data, error } = await dbClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            tbody.innerHTML = '<tr><td colspan="7" class="loading-state" style="color:red;">حدث خطأ أثناء جلب البيانات</td></tr>';
            return;
        }

        currentOrders = data || [];
        calculateKPIs(currentOrders);
        renderOrdersTable(currentOrders);

    } catch (err) {
        console.error('Fetch err', err);
        tbody.innerHTML = '<tr><td colspan="7" class="loading-state" style="color:red;">حدث خطأ في الاتصال</td></tr>';
    }
}

function calculateKPIs(orders) {
    let totalRevenue = 0;
    let todayOrders = 0;
    let pendingOrders = 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    orders.forEach(order => {
        // We only calc revenue for non-cancelled
        if (order.status !== 'ملغي' && order.status !== 'cancelled') {
            totalRevenue += (order.total_amount || 0);
        }

        // Status counting
        const status = order.status ? order.status.trim() : 'جديد';
        if (status === 'جديد' || status === 'new' || status === 'جاري التجهيز') {
            pendingOrders++;
        }

        // Today count
        const orderDate = new Date(order.created_at);
        if (orderDate >= todayStart) {
            todayOrders++;
        }
    });

    document.getElementById('kpiTotalOrders').innerText = orders.length;
    document.getElementById('kpiTotalRevenue').innerText = totalRevenue.toLocaleString('en-US');
    document.getElementById('kpiTodayOrders').innerText = todayOrders;
    document.getElementById('kpiPendingOrders').innerText = pendingOrders;
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    const filterVal = document.getElementById('statusFilter').value;

    let filteredOrders = orders;

    if (filterVal !== 'all') {
        filteredOrders = orders.filter(o => {
            const s = o.status ? o.status.trim() : 'جديد';
            return s === filterVal;
        });
    }

    if (filteredOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="loading-state">لا يوجد طلبات تطابق بحثك حالياً</td></tr>`;
        return;
    }

    let html = '';
    filteredOrders.forEach(order => {

        const date = new Date(order.created_at).toLocaleString('ar-SA', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        // Default status handling
        const rawStatus = order.status ? order.status.trim() : 'جديد';
        let statusClass = 'status-new';
        let statusText = 'جديد';

        if (rawStatus === 'جديد' || rawStatus === 'new') { statusClass = 'status-new'; statusText = 'جديد'; }
        else if (rawStatus === 'جاري التجهيز' || rawStatus === 'processing') { statusClass = 'status-processing'; statusText = 'جاري التجهيز'; }
        else if (rawStatus === 'مكتمل' || rawStatus === 'تم التوصيل' || rawStatus === 'completed') { statusClass = 'status-completed'; statusText = 'تم التوصيل'; }
        else if (rawStatus === 'ملغي' || rawStatus === 'cancelled') { statusClass = 'status-cancelled'; statusText = 'ملغي'; }

        // Summary of items
        let itemsSummary = '';
        if (order.items && Array.isArray(order.items)) {
            itemsSummary = order.items.map(i => `${i.qty}x ${i.brand}`).join('، ');
        }

        html += `
      <tr>
        <td style="font-family: monospace; font-size: 0.85rem;">#${order.id.slice(0, 8)}</td>
        <td dir="ltr">${date}</td>
        <td>
          <div style="font-weight: 500;">${order.customer_name}</div>
          <div style="font-size: 0.8rem; color:#777;" dir="ltr">${order.customer_phone}</div>
        </td>
        <td style="font-weight:bold; color:var(--clr-gold);">${order.total_amount} ر.س</td>
        <td><div class="order-items-summary" title="${itemsSummary}">${itemsSummary || 'بدون تفاصيل'}</div></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td><button class="btn-sm" onclick="viewOrderDetails('${order.id}')">التفاصيل</button></td>
      </tr>
    `;
    });

    tbody.innerHTML = html;
}

// 4. Modal Logic
window.viewOrderDetails = function (orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return;

    selectedOrderId = orderId;

    document.getElementById('modalOrderId').innerText = '#' + order.id.slice(0, 8);
    document.getElementById('modalCustomerName').innerText = order.customer_name || '-';
    document.getElementById('modalCustomerPhone').innerText = order.customer_phone || '-';
    document.getElementById('modalCity').innerText = order.city || '-';
    document.getElementById('modalAddress').innerText = order.address || '-';

    document.getElementById('modalDeliveryTime').innerText = order.delivery_time || 'أقرب وقت';
    document.getElementById('modalPayment').innerText = order.payment_method || '-';
    document.getElementById('modalNotes').innerText = order.notes || 'لا يوجد';
    document.getElementById('modalTotal').innerText = order.total_amount || '0';

    // Set Select Value
    const rawStatus = order.status ? order.status.trim() : 'جديد';
    const select = document.getElementById('modalStatusSelect');
    if (rawStatus === 'جديد' || rawStatus === 'new') select.value = 'جديد';
    else if (rawStatus === 'جاري التجهيز' || rawStatus === 'processing') select.value = 'جاري التجهيز';
    else if (rawStatus === 'مكتمل' || rawStatus === 'تم التوصيل' || rawStatus === 'completed') select.value = 'تم التوصيل';
    else if (rawStatus === 'ملغي' || rawStatus === 'cancelled') select.value = 'ملغي';
    else select.value = 'جديد';

    // Items List
    const listEl = document.getElementById('modalItemsList');
    let itemsHtml = '';
    if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
            const itemTotal = item.qty * item.price;
            itemsHtml += `
        <li>
          <div><strong>${item.brand}</strong> - ${item.size}</div>
          <div>${item.qty} × ${item.price} = <span class="text-gold">${itemTotal} ر.س</span></div>
        </li>
      `;
        });
    } else {
        itemsHtml = '<li>لا يوجد تفاصيل منتجات</li>';
    }
    listEl.innerHTML = itemsHtml;

    // Show Modal
    document.getElementById('orderDetailsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeOrderModal = function () {
    document.getElementById('orderDetailsModal').classList.remove('active');
    document.body.style.overflow = '';
    selectedOrderId = null;
}

async function updateOrderStatus() {
    if (!selectedOrderId) return;

    const newStatus = document.getElementById('modalStatusSelect').value;
    const btn = document.getElementById('btnUpdateStatus');
    const oldText = btn.innerText;

    btn.innerText = 'جاري التحديث...';
    btn.disabled = true;

    try {
        const { error } = await dbClient
            .from('orders')
            .update({ status: newStatus })
            .eq('id', selectedOrderId);

        if (error) throw error;

        // Refresh local data silently
        await fetchOrders();
        closeOrderModal();

        // Quick success flash
        const modalContent = document.querySelector('.dashboard-modal-content');
        modalContent.style.border = '2px solid #43a047';
        setTimeout(() => { modalContent.style.border = '1px solid #888'; }, 1000);

    } catch (err) {
        console.error("Status update error", err);
        alert('حدث خطأ أثناء تحديث الحالة. يرجى المحاولة مرة أخرى.');
    } finally {
        btn.innerText = oldText;
        btn.disabled = false;
    }
}
