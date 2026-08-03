/* =========================================================
   FESTA FÁCIL - STOREFRONT APPLICATION LOGIC (app.js)
   ========================================================= */

document.addEventListener('DOMContentLoaded', async () => {
  // State Global da Aplicação
  let activeCategory = 'todos';
  let searchQuery = '';
  let sortOption = 'populares';
  let cartItems = JSON.parse(localStorage.getItem('ff_cart_items_v6') || '[]');

  // DOM Elements - Header & Navigation
  const categoriesContainer = document.getElementById('categories-container');
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');
  const sortSelect = document.getElementById('sort-select');
  const filterStatusText = document.getElementById('filter-status-text');

  // DOM Elements - Badges & Counts
  const cartCountEl = document.getElementById('cart-count');

  // DOM Elements - Cart Drawer
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const btnOpenCart = document.getElementById('btn-open-cart');
  const btnCloseCart = document.getElementById('btn-close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalValueEl = document.getElementById('cart-total-value');
  const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

  // =========================================================
  // INICIALIZAÇÃO DA PÁGINA
  // =========================================================
  async function init() {
    updateBadges();
    await applySettings();
    await renderCategoriesBar();
    await renderProductsGrid();
    setupEventListeners();
  }

  async function applySettings() {
    const settings = await db.getSettings();
    if (!settings || !settings.whatsapp) return;

    let cleanPhone = String(settings.whatsapp).replace(/\D/g, '');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = '55' + cleanPhone;
    }
    if (!cleanPhone) cleanPhone = '5519999999999';

    const defaultMsg = encodeURIComponent(`Olá ${settings.nome_loja || 'Festa Fácil'}! Vim pelo site e gostaria de um orçamento.`);

    const floatBtn = document.querySelector('.whatsapp-float-btn');
    if (floatBtn) {
      floatBtn.href = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;
    }

    const heroBtn = document.querySelector('.btn-hero-secondary');
    if (heroBtn) {
      heroBtn.href = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;
    }

    // Atualiza link e texto do rodapé (Footer)
    const footerLink = document.getElementById('footer-whatsapp-link') || document.querySelector('.footer-whatsapp-link');
    const footerText = document.getElementById('footer-whatsapp-text');

    if (footerLink) {
      footerLink.href = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;
    }

    if (footerText) {
      let digits = cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone;
      if (digits.length === 11) {
        footerText.textContent = `(${digits.substring(0,2)}) ${digits.substring(2,7)}-${digits.substring(7)}`;
      } else if (digits.length === 10) {
        footerText.textContent = `(${digits.substring(0,2)}) ${digits.substring(2,6)}-${digits.substring(6)}`;
      } else {
        footerText.textContent = settings.whatsapp;
      }
    }
  }

  // Atualiza contador do carrinho
  function updateBadges() {
    const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantidade, 0);
    if (cartCountEl) cartCountEl.textContent = totalCartQty;
  }

  // =========================================================
  // RENDERIZAÇÃO DAS CATEGORIAS (CARDS QUADRADOS)
  // =========================================================
  const CATEGORY_PALETTE = ['#FF4FA3', '#00CFE8', '#FF8A3D', '#6C4AB6', '#FFD93D', '#00C897', '#4D96FF'];

  async function renderCategoriesBar() {
    if (!categoriesContainer) return;
    const categories = await db.getCategories(true);
    const products = await db.getProducts(null, '', true);

    // Mapear apenas categorias que possuem produtos ativos cadastrados
    const activeCategoryIds = new Set(products.map(p => p.categoria_id));
    const categoriesWithProducts = categories.filter(c => activeCategoryIds.has(c.id));
    
    let html = `
      <button class="category-card-btn ${activeCategory === 'todos' ? 'active' : ''}" data-cat="todos" data-tooltip="Todos os Produtos">
        <i class="fa-solid fa-border-all"></i>
        <span class="cat-label">Todos</span>
      </button>
    `;

    categoriesWithProducts.forEach((cat, idx) => {
      const iconClass = cat.icone && cat.icone.startsWith('fa-') ? cat.icone : 'fa-shapes';
      const catColor = cat.cor || CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
      const isActive = activeCategory === cat.id;

      html += `
        <button class="category-card-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}" data-tooltip="${cat.nome}" style="${!isActive ? `border-color: ${catColor}70;` : ''}">
          <i class="fa-solid ${iconClass}" style="${!isActive ? `color: ${catColor};` : ''}"></i>
          <span class="cat-label" style="${!isActive ? `color: ${catColor};` : ''}">${cat.nome}</span>
        </button>
      `;
    });

    categoriesContainer.innerHTML = html;

    // Adiciona evento de clique aos cards de categoria
    document.querySelectorAll('.category-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat');
        activeCategory = catId;

        document.querySelectorAll('.category-card-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderProductsGrid();
      });
    });
  }

  // =========================================================
  // RENDERIZAÇÃO DA VITRINE DE PRODUTOS
  // =========================================================
  async function renderProductsGrid() {
    if (!productsGrid) return;
    let products = await db.getProducts(activeCategory, searchQuery, true);
    const categories = await db.getCategories();
    const catMap = new Map(categories.map(c => [c.id, c.nome]));

    // Ordenação
    if (sortOption === 'menor-preco') {
      products.sort((a, b) => a.preco_inicio - b.preco_inicio);
    } else if (sortOption === 'maior-preco') {
      products.sort((a, b) => b.preco_inicio - a.preco_inicio);
    } else {
      products.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    }

    if (filterStatusText) {
      filterStatusText.textContent = `Exibindo ${products.length} produto(s)`;
    }

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-face-sad-tear" style="color: var(--primary-pink);"></i></div>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente buscar por outro termo ou selecione outra categoria de festa.</p>
        </div>
      `;
      return;
    }

    let gridHtml = '';
    products.forEach(p => {
      const categoryName = catMap.get(p.categoria_id) || 'Personalizados';

      gridHtml += `
        <div class="product-card" data-id="${p.id}">
          <div class="card-img-container">
            <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
            <span class="card-badge-category">${categoryName}</span>
          </div>

          <div class="card-content">
            <h3 class="product-title">${p.nome}</h3>
            <p class="product-description">${p.descricao || ''}</p>

            <div class="product-price-box">
              <div class="price-label">A partir de</div>
              <div class="price-value">R$ ${parseFloat(p.preco_inicio).toFixed(2).replace('.', ',')}</div>
            </div>

            <button class="btn-add-cart btn-quick-add" data-product-id="${p.id}">
              <i class="fa-solid fa-cart-plus"></i>
              <span>Adicionar ao Orçamento</span>
            </button>
          </div>
        </div>
      `;
    });

    productsGrid.innerHTML = gridHtml;

    // Clique em Adicionar Direto ao Carrinho de Orçamento (1-Click)
    document.querySelectorAll('.btn-quick-add').forEach(btn => {
      btn.addEventListener('click', async () => {
        const prodId = btn.getAttribute('data-product-id');
        const product = await db.getProductById(prodId);
        if (!product) return;

        // Adiciona ao carrinho imediatamente
        const item = {
          cart_id: 'cart-item-' + Date.now(),
          produto_id: product.id,
          nome: product.nome,
          imagem: product.imagem,
          preco_inicio: product.preco_inicio,
          quantidade: 1
        };

        cartItems.push(item);
        localStorage.setItem('ff_cart_items_v6', JSON.stringify(cartItems));

        updateBadges();
        openCartDrawer();
      });
    });
  }

  // =========================================================
  // CARRINHO DE ORÇAMENTO & CHECKOUT WHATSAPP
  // =========================================================
  function openCartDrawer() {
    renderCartItems();
    if (cartBackdrop) cartBackdrop.classList.add('open');
    if (cartDrawer) cartDrawer.classList.add('open');
  }

  function closeCartDrawer() {
    if (cartBackdrop) cartBackdrop.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
  }

  function renderCartItems() {
    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-state" style="padding: 40px 20px;">
          <div class="empty-state-icon"><i class="fa-solid fa-bag-shopping" style="color: var(--primary-pink-light);"></i></div>
          <h4 style="color: var(--text-main); margin-bottom: 6px;">Seu carrinho de orçamento está vazio</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Clique em "Adicionar ao Orçamento" nos produtos para solicitar sua cotação!</p>
        </div>
      `;
      if (cartTotalValueEl) cartTotalValueEl.textContent = 'R$ 0,00';
      return;
    }

    let html = '';
    let totalValue = 0;

    cartItems.forEach((item, index) => {
      const subtotal = item.preco_inicio * item.quantidade;
      totalValue += subtotal;

      html += `
        <div class="cart-item-card">
          <button class="cart-item-remove" data-index="${index}" title="Remover item">
            <i class="fa-solid fa-trash-can"></i>
          </button>

          <div class="cart-item-main">
            <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.nome}</div>
              <div class="cart-item-price">${item.quantidade}x (A partir de R$ ${parseFloat(item.preco_inicio).toFixed(2).replace('.', ',')})</div>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    if (cartTotalValueEl) cartTotalValueEl.textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;

    // Eventos de remover item
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cartItems.splice(idx, 1);
        localStorage.setItem('ff_cart_items_v6', JSON.stringify(cartItems));
        updateBadges();
        renderCartItems();
      });
    });
  }

  // Envio do Orçamento para a Vendedora via WhatsApp
  if (btnSendWhatsapp) {
    btnSendWhatsapp.addEventListener('click', async () => {
      if (cartItems.length === 0) {
        alert('Seu carrinho está vazio. Adicione pelo menos um produto!');
        return;
      }

      const nameInput = document.getElementById('checkout-client-name');
      const cityInput = document.getElementById('checkout-client-city');

      const clientName = (nameInput && nameInput.value.trim()) || 'Cliente';
      const clientCity = (cityInput && cityInput.value.trim()) || 'São Pedro / SP';
      const settings = await db.getSettings();
      let phone = String(settings.whatsapp || '5519999999999').replace(/\D/g, '');
      if (phone.length === 10 || phone.length === 11) {
        phone = '55' + phone;
      }
      if (!phone) phone = '5519999999999';

      let totalValue = 0;
      let productsMessageText = '';

      cartItems.forEach((item, idx) => {
        const itemSubtotal = item.preco_inicio * item.quantidade;
        totalValue += itemSubtotal;

        productsMessageText += `\n*${idx + 1}. ${item.nome}*\n`;
        productsMessageText += `• Quantidade: ${item.quantidade} unidade(s)\n`;
        productsMessageText += `• Valor Base: R$ ${parseFloat(item.preco_inicio).toFixed(2).replace('.', ',')}\n`;
      });

      const fullMessage = `Olá ${settings.nome_loja}! 💖\n\nGostaria de solicitar um orçamento sem compromisso para os seguintes itens:\n${productsMessageText}\n📍 *DADOS DO CLIENTE:*\n• Nome: ${clientName}\n• Local: ${clientCity}\n\n💰 *SUBTOTAL BASE ESTIMADO:* R$ ${totalValue.toFixed(2).replace('.', ',')}\n_(Gostaria de negociar a personalização, quantidade e o valor final com a vendedora!)_ 😊`;

      // Abrir WhatsApp
      const encodedMsg = encodeURIComponent(fullMessage);
      window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
    });
  }

  // =========================================================
  // EVENT LISTENERS GERAIS
  // =========================================================
  function setupEventListeners() {
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (searchInput) searchQuery = searchInput.value.trim();
        renderProductsGrid();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderProductsGrid();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortOption = e.target.value;
        renderProductsGrid();
      });
    }

    if (btnOpenCart) btnOpenCart.addEventListener('click', openCartDrawer);
    if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);
  }

  // Executa Inicialização
  init();
});
