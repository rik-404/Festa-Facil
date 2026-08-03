/* =========================================================
   FESTA FÁCIL - DATABASE & DATA ACCESS LAYER (db.js)
   Integrado com Supabase PostgreSQL Cloud & LocalStorage Backup
   ========================================================= */

const SUPABASE_URL = 'https://vvrmbjytupwppsmssrcv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cm1ianl0dXB3cHBzbXNzcmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MjI3NjQsImV4cCI6MjEwMTI5ODc2NH0.A7rjDxAGMmF2VdTYiYLDOB0ofZ3Hb2jeUZeJSUxmNGE';

// Inicializar cliente do Supabase se disponível no navegador
let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase conectado com sucesso:', SUPABASE_URL);
  } catch (err) {
    console.warn('⚠️ Erro ao inicializar cliente Supabase, usando LocalStorage fallback:', err);
  }
}

const LOCAL_STORAGE_KEYS = {
  CATEGORIES: 'ff_categorias_v6',
  PRODUCTS: 'ff_produtos_v6',
  ORDERS: 'ff_pedidos_v6',
  SETTINGS: 'ff_config_v6'
};

// Seed inicial sem emoticons - Usando apenas ícones Flat FontAwesome
const DEFAULT_SEED_DATA = {
  configuracoes: {
    nome_loja: 'Festa Fácil',
    cidade: 'São Pedro/SP',
    whatsapp: '5519999999999',
    slogan: 'Personalizados feitos com amor em São Pedro/SP • Criamos • Personalizamos • Encantamos'
  },
  categorias: [
    { id: 'c1111111-1111-1111-1111-111111111111', nome: 'Topos de Bolo', slug: 'topos-de-bolo', icone: 'fa-cake-candles', cor: '#FF4FA3', status: 'ativo', ordem: 1 },
    { id: 'c2222222-2222-2222-2222-222222222222', nome: 'Caixinhas Personalizadas', slug: 'caixinhas', icone: 'fa-box-open', cor: '#00CFE8', status: 'ativo', ordem: 2 },
    { id: 'c3333333-3333-3333-3333-333333333333', nome: 'Canecas', slug: 'canecas', icone: 'fa-mug-hot', cor: '#FF8A3D', status: 'ativo', ordem: 3 },
    { id: 'c4444444-4444-4444-4444-444444444444', nome: 'Lembrancinhas', slug: 'lembrancinhas', icone: 'fa-wand-magic-sparkles', cor: '#6C4AB6', status: 'ativo', ordem: 4 },
    { id: 'c5555555-5555-5555-5555-555555555555', nome: 'Kits Festa', slug: 'kits-festa', icone: 'fa-gift', cor: '#FFD93D', status: 'ativo', ordem: 5 },
    { id: 'c6666666-6666-6666-6666-666666666666', nome: 'Datas Especiais', slug: 'datas-especiais', icone: 'fa-star', cor: '#00C897', status: 'ativo', ordem: 6 }
  ],
  produtos: [
    {
      id: 'prod-1',
      categoria_id: 'c5555555-5555-5555-5555-555555555555',
      nome: 'Kit Personalizado Safari',
      descricao: 'Kit completo contendo 20 caixinhas variadas (Milk, Cone, Pyramide e Maletinha) com apliques 3D e laços de cetim premium no tema Safari.',
      imagem: 'image.png',
      preco_inicio: 35.00,
      destaque: true,
      status: 'ativo',
      views_count: 142
    },
    {
      id: 'prod-2',
      categoria_id: 'c1111111-1111-1111-1111-111111111111',
      nome: 'Topo de Bolo 3D Luxo',
      descricao: 'Topo de bolo personalizável em papel fotográfico 230g e lamicote dourado com camada 3D, nome, idade e elementos em relevo.',
      imagem: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      preco_inicio: 28.00,
      destaque: true,
      status: 'ativo',
      views_count: 98
    },
    {
      id: 'prod-3',
      categoria_id: 'c3333333-3333-3333-3333-333333333333',
      nome: 'Caneca de Porcelana Personalizada',
      descricao: 'Caneca de porcelana de alta qualidade 325ml com estampa sublimada durável. Personalizamos com fotos, nomes, frases e temas.',
      imagem: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      preco_inicio: 32.00,
      destaque: true,
      status: 'ativo',
      views_count: 215
    },
    {
      id: 'prod-4',
      categoria_id: 'c2222222-2222-2222-2222-222222222222',
      nome: 'Caixinha Milk Mágica Princesa',
      descricao: 'Caixa formato Milk personalizada com papel offset fosco 180g, fita de cetim e pedra strass. Ideal para guloseimas de festa.',
      imagem: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      preco_inicio: 5.50,
      destaque: false,
      status: 'ativo',
      views_count: 67
    },
    {
      id: 'prod-5',
      categoria_id: 'c4444444-4444-4444-4444-444444444444',
      nome: 'Lembrancinha Tubete com Aplique 3D',
      descricao: 'Tubete em acrílico 13cm com tampa colorida e aplique personalizado em papel fotográfico brilhante no tema desejado.',
      imagem: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      preco_inicio: 4.20,
      destaque: false,
      status: 'ativo',
      views_count: 45
    },
    {
      id: 'prod-6',
      categoria_id: 'c5555555-5555-5555-5555-555555555555',
      nome: 'Kit Pegue e Monte Infantil',
      descricao: 'Kit prático contendo 30 peças vincadas e cortadas eletronicamente prontas para montagem simples em casa. Acompanha fita e laços.',
      imagem: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      preco_inicio: 45.00,
      destaque: true,
      status: 'ativo',
      views_count: 310
    },
    {
      id: 'prod-7',
      categoria_id: 'c6666666-6666-6666-6666-666666666666',
      nome: 'Kit Caixinhas Batizado Pompom',
      descricao: 'Conjunto delicado em tons anjo/pastéis com aplicação de anjinho em relevo, laço acetinado e tag de agradecimento personalizada.',
      imagem: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
      preco_inicio: 38.00,
      destaque: false,
      status: 'ativo',
      views_count: 88
    }
  ],
  pedidos: [
    {
      id: 'ped-101',
      codigo_pedido: 'FF-8492',
      cliente_nome: 'Mariana Silva',
      cliente_telefone: '(19) 99123-4567',
      cliente_cidade: 'São Pedro / SP',
      produtos_json: [
        { nome: 'Kit Personalizado Safari', quantidade: 1, preco_inicio: 35.00, tema: 'Safari Baby', nome_aniv: 'Gael', idade: '2 anos' }
      ],
      valor_estimado: 35.00,
      status: 'em_producao',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

class DBManager {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_SEED_DATA.categorias));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_SEED_DATA.produtos));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_SEED_DATA.pedidos));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SEED_DATA.configuracoes));
    }
  }

  // --- CATEGORIAS ---
  async getCategories(onlyActive = false) {
    let data = [];
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('categorias').select('*').order('ordem', { ascending: true });
        if (onlyActive) query = query.eq('status', 'ativo');
        const res = await query;
        if (!res.error && res.data && res.data.length > 0) {
          data = res.data;
          localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(data));
        }
      } catch (err) {
        console.warn('Consulta Supabase categorias falhou, utilizando fallback local:', err);
      }
    }

    if (!data || data.length === 0) {
      data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES) || '[]');
    }

    if (!data || data.length === 0) {
      data = DEFAULT_SEED_DATA.categorias;
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(data));
    }

    if (onlyActive) {
      return data.filter(c => c.status === 'ativo' || !c.status).sort((a,b) => (a.ordem || 0) - (b.ordem || 0));
    }
    return data.sort((a,b) => (a.ordem || 0) - (b.ordem || 0));
  }

  async saveCategory(category) {
    if (!category.status) category.status = 'ativo';

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('categorias').upsert(category).select();
        if (!error && data) {
          console.log('Categoria salva no Supabase:', data);
        }
      } catch (err) {
        console.warn('Erro ao salvar no Supabase:', err);
      }
    }

    const categories = await this.getCategories();
    if (category.id) {
      const idx = categories.findIndex(c => c.id === category.id);
      if (idx !== -1) categories[idx] = { ...categories[idx], ...category };
      else categories.push(category);
    } else {
      category.id = 'cat-' + Date.now();
      category.ordem = categories.length + 1;
      categories.push(category);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return category;
  }

  async deleteCategory(id) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('categorias').delete().eq('id', id);
      } catch (err) {
        console.warn('Erro ao deletar no Supabase:', err);
      }
    }

    let categories = await this.getCategories();
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  }

  // --- PRODUTOS ---
  async getProducts(filterCategory = null, searchQuery = '', onlyActive = true) {
    let list = [];
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('produtos').select('*');
        if (onlyActive) query = query.eq('status', 'ativo');
        const res = await query;
        if (!res.error && res.data && res.data.length > 0) {
          list = res.data;
          localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Consulta produtos Supabase falhou, utilizando fallback local:', err);
      }
    }

    if (!list || list.length === 0) {
      list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
    }

    if (!list || list.length === 0) {
      list = DEFAULT_SEED_DATA.produtos;
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    }

    // Garantir status ativo se não preenchido
    list.forEach(p => {
      if (!p.status) p.status = 'ativo';
    });

    if (onlyActive) {
      list = list.filter(p => p.status === 'ativo');
    }
    if (filterCategory && filterCategory !== 'todos') {
      list = list.filter(p => p.categoria_id === filterCategory);
    }
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.nome.toLowerCase().includes(q) || (p.descricao && p.descricao.toLowerCase().includes(q)));
    }
    return list;
  }

  async getProductById(id) {
    const list = await this.getProducts(null, '', false);
    return list.find(p => p.id === id) || null;
  }

  async saveProduct(product) {
    if (!product.status) product.status = 'ativo';

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('produtos').upsert(product).select();
        if (!error && data) {
          console.log('Produto salvo no Supabase:', data);
        }
      } catch (err) {
        console.warn('Erro ao salvar produto no Supabase:', err);
      }
    }

    const products = await this.getProducts(null, '', false);
    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) products[idx] = { ...products[idx], ...product };
      else products.push(product);
    } else {
      product.id = 'prod-' + Date.now();
      product.views_count = 0;
      products.push(product);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  }

  async deleteProduct(id) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('produtos').delete().eq('id', id);
      } catch (err) {
        console.warn('Erro ao deletar produto no Supabase:', err);
      }
    }

    let products = await this.getProducts(null, '', false);
    products = products.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  }

  // --- PEDIDOS ---
  async getOrders() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('pedidos').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Erro ao buscar pedidos no Supabase:', err);
      }
    }

    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  }

  async saveOrder(orderData) {
    const newOrder = {
      id: 'ped-' + Date.now(),
      codigo_pedido: 'FF-' + Math.floor(1000 + Math.random() * 9000),
      status: 'novo',
      created_at: new Date().toISOString(),
      ...orderData
    };

    if (supabaseClient) {
      try {
        await supabaseClient.from('pedidos').insert(newOrder);
      } catch (err) {
        console.warn('Erro ao inserir pedido no Supabase:', err);
      }
    }

    const orders = await this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  async updateOrderStatus(id, status) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('pedidos').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Erro ao atualizar status no Supabase:', err);
      }
    }

    const orders = await this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
    return true;
  }

  // --- CONFIGURAÇÕES ---
  async getSettings() {
    let data = null;
    if (supabaseClient) {
      try {
        const res = await supabaseClient.from('configuracoes').select('*').limit(1);
        if (!res.error && res.data && res.data.length > 0) {
          data = res.data[0];
          localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(data));
        }
      } catch (err) {
        console.warn('Erro ao buscar configurações no Supabase, usando local:', err);
      }
    }

    if (!data) {
      data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS) || 'null');
    }

    if (!data) {
      data = DEFAULT_SEED_DATA.configuracoes;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(data));
    }

    return data;
  }

  async saveSettings(settings) {
    let targetId = 1;
    const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS) || 'null');
    if (current && current.id) targetId = current.id;

    const fullSettings = {
      id: targetId,
      ...settings,
      updated_at: new Date().toISOString()
    };

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('configuracoes').upsert(fullSettings).select();
        if (error) {
          console.error('Erro ao salvar configuracoes no Supabase:', error);
        } else {
          console.log('✅ Configurações salvas no Supabase com sucesso:', data);
          if (data && data.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(data[0]));
            return data[0];
          }
        }
      } catch (err) {
        console.warn('Erro ao salvar configuracoes no Supabase:', err);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(fullSettings));
    return fullSettings;
  }
}

// Instância global exportada
const db = new DBManager();
