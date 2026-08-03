/* =========================================================
   FESTA FÁCIL - ADMIN BACKOFFICE LOGIC (admin.js)
   ========================================================= */

document.addEventListener('DOMContentLoaded', async () => {
  const ADMIN_SESSION_KEY = 'ff_admin_authenticated';
  
  // Elements Auth
  const loginModalBackdrop = document.getElementById('login-modal-backdrop');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPassInput = document.getElementById('admin-pass-input');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const adminMainWrapper = document.getElementById('admin-main-wrapper');
  const btnAdminLogout = document.getElementById('btn-admin-logout');

  // Check Auth State
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
    loginModalBackdrop.classList.remove('open');
    adminMainWrapper.style.display = 'block';
    loadDashboard();
  }

  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = adminPassInput.value.trim();
    if (pass === 'admin123' || pass === 'admin') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      loginModalBackdrop.classList.remove('open');
      adminMainWrapper.style.display = 'block';
      loadDashboard();
    } else {
      loginErrorMsg.style.display = 'block';
    }
  });

  btnAdminLogout.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.reload();
  });

  // Tab Switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      document.getElementById(targetTab).style.display = 'block';

      if (targetTab === 'tab-dashboard') loadDashboard();
      if (targetTab === 'tab-categories') loadCategoriesTable();
      if (targetTab === 'tab-products') loadProductsTable();
      if (targetTab === 'tab-orders') loadOrdersTable();
      if (targetTab === 'tab-settings') loadSettingsForm();
    });
  });

  // =========================================================
  // DASHBOARD TAB
  // =========================================================
  async function loadDashboard() {
    const products = await db.getProducts(null, '', false);
    const categories = await db.getCategories();
    const orders = await db.getOrders();

    document.getElementById('stat-products-count').textContent = products.length;
    document.getElementById('stat-categories-count').textContent = categories.filter(c => c.status === 'ativo').length;
    document.getElementById('stat-orders-count').textContent = orders.length;

    const totalViews = products.reduce((acc, p) => acc + (p.views_count || 0), 0);
    document.getElementById('stat-views-count').textContent = totalViews;

    // Top products table
    const topProducts = [...products].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);
    const catMap = new Map(categories.map(c => [c.id, c.nome]));

    let html = '';
    topProducts.forEach(p => {
      html += `
        <tr>
          <td><strong>${p.nome}</strong></td>
          <td>${catMap.get(p.categoria_id) || 'Personalizados'}</td>
          <td>R$ ${parseFloat(p.preco_inicio).toFixed(2).replace('.', ',')}</td>
          <td><i class="fa-solid fa-eye" style="color: var(--primary-pink);"></i> ${p.views_count || 0}</td>
        </tr>
      `;
    });
    document.getElementById('top-products-tbody').innerHTML = html;
  }

  // =========================================================
  // CATEGORIES TAB & CRUD
  // =========================================================
  const CATEGORY_PALETTE = ['#FF4FA3', '#00CFE8', '#FF8A3D', '#6C4AB6', '#FFD93D', '#00C897', '#4D96FF'];
  const categoryModalBackdrop = document.getElementById('category-modal-backdrop');
  const btnAddCategory = document.getElementById('btn-add-category');
  const btnCloseCatModal = document.getElementById('btn-close-cat-modal');
  const categoryForm = document.getElementById('category-form');
  const catIconInput = document.getElementById('cat-icon-input');

  // Listeners dos seletores de ícones no modal
  document.querySelectorAll('.icon-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catIconInput.value = btn.getAttribute('data-icon');
    });
  });

  async function loadCategoriesTable() {
    const categories = await db.getCategories();
    let html = '';

    categories.forEach((cat, idx) => {
      const iconClass = cat.icone && cat.icone.startsWith('fa-') ? cat.icone : 'fa-shapes';
      const catColor = cat.cor || CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];

      html += `
        <tr>
          <td>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: ${catColor}15; display: flex; align-items: center; justify-content: center; border: 2px solid ${catColor};">
              <i class="fa-solid ${iconClass}" style="font-size: 1.1rem; color: ${catColor};"></i>
            </div>
          </td>
          <td><strong>${cat.nome}</strong></td>
          <td>
            <span class="status-badge" style="background: ${catColor}18; color: ${catColor}; font-weight:700; border: 1px solid ${catColor}40;">
              ${cat.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
          </td>
          <td>${cat.ordem || 0}</td>
          <td>
            <button class="btn-primary-sm btn-edit-cat" data-id="${cat.id}" style="padding: 4px 10px; font-size: 0.8rem;">
              <i class="fa-solid fa-pen"></i> Editar
            </button>
            <button class="btn-admin-link btn-del-cat" data-id="${cat.id}" style="padding: 4px 10px; font-size: 0.8rem; color: red; border-color: red;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    document.getElementById('categories-tbody').innerHTML = html;

    // Attach listeners
    document.querySelectorAll('.btn-edit-cat').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const cats = await db.getCategories();
        const cat = cats.find(c => c.id === id);
        if (cat) {
          document.getElementById('cat-modal-title').textContent = 'Editar Categoria';
          document.getElementById('cat-id-input').value = cat.id;
          document.getElementById('cat-name-input').value = cat.nome;
          catIconInput.value = cat.icone || 'fa-cake-candles';
          document.getElementById('cat-status-select').value = cat.status;

          // Marca ícone ativo
          document.querySelectorAll('.icon-picker-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-icon') === cat.icone);
          });

          categoryModalBackdrop.classList.add('open');
        }
      });
    });

    document.querySelectorAll('.btn-del-cat').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
          await db.deleteCategory(btn.getAttribute('data-id'));
          loadCategoriesTable();
        }
      });
    });
  }

  btnAddCategory.addEventListener('click', () => {
    document.getElementById('cat-modal-title').textContent = 'Nova Categoria';
    categoryForm.reset();
    document.getElementById('cat-id-input').value = '';
    catIconInput.value = 'fa-cake-candles';
    
    document.querySelectorAll('.icon-picker-btn').forEach((b, idx) => b.classList.toggle('active', idx === 0));

    categoryModalBackdrop.classList.add('open');
  });

  btnCloseCatModal.addEventListener('click', () => categoryModalBackdrop.classList.remove('open'));

  categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cat-id-input').value;
    const nome = document.getElementById('cat-name-input').value.trim();
    const icone = catIconInput.value;
    const status = document.getElementById('cat-status-select').value;

    await db.saveCategory({
      id: id || undefined,
      nome,
      slug: nome.toLowerCase().replace(/ /g, '-'),
      icone,
      status
    });

    categoryModalBackdrop.classList.remove('open');
    loadCategoriesTable();
  });

  // =========================================================
  // PRODUCTS TAB & CRUD
  // =========================================================
  const productCrudModalBackdrop = document.getElementById('product-crud-modal-backdrop');
  const btnAddProduct = document.getElementById('btn-add-product');
  const btnCloseProdCrudModal = document.getElementById('btn-close-prod-crud-modal');
  const productCrudForm = document.getElementById('product-crud-form');
  const adminProductSearch = document.getElementById('admin-product-search');
  const prodImgInput = document.getElementById('prod-img-input');
  const prodFileInput = document.getElementById('prod-file-input');
  const prodImgPreview = document.getElementById('prod-img-preview');

  // Upload de imagem via arquivo do computador
  prodFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        prodImgInput.value = evt.target.result;
        prodImgPreview.src = evt.target.result;
        prodImgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  prodImgInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val) {
      prodImgPreview.src = val;
      prodImgPreview.style.display = 'block';
    } else {
      prodImgPreview.style.display = 'none';
    }
  });

  async function loadProductsTable() {
    const q = adminProductSearch.value.trim();
    const products = await db.getProducts(null, q, false);
    const categories = await db.getCategories();
    const catMap = new Map(categories.map(c => [c.id, c.nome]));

    let html = '';
    products.forEach(p => {
      html += `
        <tr>
          <td><img src="${p.imagem}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;"></td>
          <td><strong>${p.nome}</strong> ${p.destaque ? '<span class="status-badge active" style="background:#FFF0F6; color:var(--primary-pink);">Destaque</span>' : ''}</td>
          <td>${catMap.get(p.categoria_id) || 'Personalizados'}</td>
          <td>R$ ${parseFloat(p.preco_inicio).toFixed(2).replace('.', ',')}</td>
          <td>
            <span class="status-badge ${p.status === 'ativo' ? 'active' : 'inactive'}">
              ${p.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
          </td>
          <td>
            <button class="btn-primary-sm btn-edit-prod" data-id="${p.id}" style="padding: 4px 10px; font-size: 0.8rem;">
              <i class="fa-solid fa-pen"></i> Editar
            </button>
            <button class="btn-admin-link btn-del-prod" data-id="${p.id}" style="padding: 4px 10px; font-size: 0.8rem; color: red; border-color: red;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    document.getElementById('products-tbody').innerHTML = html;

    // Listeners
    document.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const prod = await db.getProductById(id);
        if (prod) {
          await populateCategoriesSelect();
          document.getElementById('prod-modal-title').textContent = 'Editar Produto';
          document.getElementById('prod-id-input').value = prod.id;
          document.getElementById('prod-name-input').value = prod.nome;
          document.getElementById('prod-cat-select').value = prod.categoria_id;
          document.getElementById('prod-price-input').value = prod.preco_inicio;
          document.getElementById('prod-desc-input').value = prod.descricao || '';
          document.getElementById('prod-img-input').value = prod.imagem || '';
          document.getElementById('prod-status-select').value = prod.status;
          document.getElementById('prod-destaque-checkbox').checked = !!prod.destaque;

          if (prod.imagem) {
            prodImgPreview.src = prod.imagem;
            prodImgPreview.style.display = 'block';
          } else {
            prodImgPreview.style.display = 'none';
          }

          productCrudModalBackdrop.classList.add('open');
        }
      });
    });

    document.querySelectorAll('.btn-del-prod').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Excluir este produto permanentemente?')) {
          await db.deleteProduct(btn.getAttribute('data-id'));
          loadProductsTable();
        }
      });
    });
  }

  async function populateCategoriesSelect() {
    const categories = await db.getCategories();
    let selectHtml = '';
    categories.forEach(c => {
      selectHtml += `<option value="${c.id}">${c.nome}</option>`;
    });
    document.getElementById('prod-cat-select').innerHTML = selectHtml;
  }

  btnAddProduct.addEventListener('click', async () => {
    await populateCategoriesSelect();
    document.getElementById('prod-modal-title').textContent = 'Novo Produto';
    productCrudForm.reset();
    document.getElementById('prod-id-input').value = '';
    prodImgPreview.style.display = 'none';
    productCrudModalBackdrop.classList.add('open');
  });

  btnCloseProdCrudModal.addEventListener('click', () => productCrudModalBackdrop.classList.remove('open'));

  productCrudForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prod-id-input').value;
    const nome = document.getElementById('prod-name-input').value.trim();
    const categoria_id = document.getElementById('prod-cat-select').value;
    const preco_inicio = parseFloat(document.getElementById('prod-price-input').value);
    const descricao = document.getElementById('prod-desc-input').value.trim();
    const imagem = document.getElementById('prod-img-input').value.trim() || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80';
    const status = document.getElementById('prod-status-select').value;
    const destaque = document.getElementById('prod-destaque-checkbox').checked;

    await db.saveProduct({
      id: id || undefined,
      nome,
      categoria_id,
      preco_inicio,
      descricao,
      imagem,
      status,
      destaque
    });

    productCrudModalBackdrop.classList.remove('open');
    loadProductsTable();
  });

  adminProductSearch.addEventListener('input', loadProductsTable);

  // =========================================================
  // ORDERS TAB
  // =========================================================
  async function loadOrdersTable() {
    const orders = await db.getOrders();
    let html = '';

    orders.forEach(o => {
      const dateFormatted = new Date(o.created_at).toLocaleDateString('pt-BR');

      html += `
        <tr>
          <td><strong>${o.codigo_pedido || 'FF-0000'}</strong></td>
          <td>${o.cliente_nome}</td>
          <td>${o.cliente_cidade || 'São Pedro / SP'}</td>
          <td>R$ ${parseFloat(o.valor_estimado).toFixed(2).replace('.', ',')}</td>
          <td>${dateFormatted}</td>
          <td>
            <select class="form-select order-status-select" data-id="${o.id}" style="padding: 4px 8px; font-size: 0.82rem;">
              <option value="novo" ${o.status === 'novo' ? 'selected' : ''}>Novo</option>
              <option value="em_producao" ${o.status === 'em_producao' ? 'selected' : ''}>Em Produção</option>
              <option value="concluido" ${o.status === 'concluido' ? 'selected' : ''}>Concluído</option>
              <option value="cancelado" ${o.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
          </td>
          <td>
            <button class="btn-primary-sm btn-view-order" data-id="${o.id}" style="padding: 4px 10px; font-size: 0.8rem;">
              <i class="fa-solid fa-eye"></i> Detalhes
            </button>
          </td>
        </tr>
      `;
    });

    document.getElementById('orders-tbody').innerHTML = html;

    document.querySelectorAll('.order-status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const id = sel.getAttribute('data-id');
        await db.updateOrderStatus(id, sel.value);
      });
    });

    document.querySelectorAll('.btn-view-order').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const orders = await db.getOrders();
        const order = orders.find(o => o.id === id);
        if (order) {
          alert(`PEDIDO: ${order.codigo_pedido}\nCliente: ${order.cliente_nome}\nValor Estimado: R$ ${order.valor_estimado.toFixed(2)}\n\nItens:\n` + JSON.stringify(order.produtos_json, null, 2));
        }
      });
    });
  }

  // =========================================================
  // SETTINGS TAB
  // =========================================================
  async function loadSettingsForm() {
    const settings = await db.getSettings();
    document.getElementById('set-store-name').value = settings.nome_loja || 'Festa Fácil';
    document.getElementById('set-whatsapp').value = settings.whatsapp || '5519999999999';
    document.getElementById('set-slogan').value = settings.slogan || '';
    if (document.getElementById('set-city')) {
      document.getElementById('set-city').value = settings.cidade || 'São Pedro/SP';
    }
  }

  document.getElementById('store-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome_loja = document.getElementById('set-store-name').value.trim();
    const whatsapp = document.getElementById('set-whatsapp').value.trim();
    const slogan = document.getElementById('set-slogan').value.trim();
    const cidade = document.getElementById('set-city') ? document.getElementById('set-city').value.trim() : 'São Pedro/SP';

    await db.saveSettings({ nome_loja, whatsapp, slogan, cidade });
    alert('✅ Configurações salvas no Supabase com sucesso!');
  });
});
