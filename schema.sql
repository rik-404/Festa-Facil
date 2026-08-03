-- =========================================================
-- BANCO DE DADOS: FESTA FÁCIL (São Pedro/SP)
-- SUPABASE / POSTGRESQL SCHEMA & SEED DATA
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icone VARCHAR(50) DEFAULT '🎉',
    status VARCHAR(20) DEFAULT 'ativo', -- 'ativo' | 'inativo'
    ordem INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    imagem TEXT,
    preco_inicio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    destaque BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ativo', -- 'ativo' | 'inativo'
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_pedido VARCHAR(20) NOT NULL UNIQUE,
    cliente_nome VARCHAR(150) NOT NULL,
    cliente_telefone VARCHAR(30),
    cliente_cidade VARCHAR(100) DEFAULT 'São Pedro / SP',
    produtos_json JSONB NOT NULL,
    valor_estimado DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'novo', -- 'novo', 'em_producao', 'concluido', 'cancelado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE CONFIGURAÇÕES DA LOJA
CREATE TABLE IF NOT EXISTS public.configuracoes (
    id INT PRIMARY KEY DEFAULT 1,
    nome_loja VARCHAR(100) DEFAULT 'Festa Fácil',
    cidade VARCHAR(100) DEFAULT 'São Pedro/SP',
    whatsapp VARCHAR(30) DEFAULT '5519999999999',
    slogan TEXT DEFAULT 'Personalizados feitos com amor em São Pedro/SP',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR RLS (Row Level Security)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE LEITURA PÚBLICA (Vitrine do Cliente)
CREATE POLICY "Permitir leitura publica de categorias ativas" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Permitir leitura publica de produtos ativados" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Permitir insercao publica de pedidos" ON public.pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura publica de configuracoes" ON public.configuracoes FOR SELECT USING (true);

-- POLÍTICAS DE ESCRITA COMPLETA PARA ADM
CREATE POLICY "Permitir gerenciamento total de categorias" ON public.categorias USING (true) WITH CHECK (true);
CREATE POLICY "Permitir gerenciamento total de produtos" ON public.produtos USING (true) WITH CHECK (true);
CREATE POLICY "Permitir gerenciamento total de pedidos" ON public.pedidos USING (true) WITH CHECK (true);
CREATE POLICY "Permitir gerenciamento de configuracoes" ON public.configuracoes USING (true) WITH CHECK (true);

-- =========================================================
-- SEED DATA INICIAL (DADOS DE EXEMPLO)
-- =========================================================

-- Inserir Configuração Inicial
INSERT INTO public.configuracoes (id, nome_loja, cidade, whatsapp, slogan)
VALUES (1, 'Festa Fácil 💖', 'São Pedro/SP', '5519999999999', 'Personalizados feitos com amor em São Pedro/SP • Criamos • Personalizamos • Encantamos')
ON CONFLICT (id) DO NOTHING;

-- Inserir Categorias Padrão
INSERT INTO public.categorias (id, nome, slug, icone, status, ordem) VALUES
('c1111111-1111-1111-1111-111111111111', 'Topos de Bolo', 'topos-de-bolo', '🎂', 'ativo', 1),
('c2222222-2222-2222-2222-222222222222', 'Caixinhas Personalizadas', 'caixinhas', '🎁', 'ativo', 2),
('c3333333-3333-3333-3333-333333333333', 'Canecas', 'canecas', '☕', 'ativo', 3),
('c4444444-4444-4444-4444-444444444444', 'Lembrancinhas', 'lembrancinhas', '🎉', 'ativo', 4),
('c5555555-5555-5555-5555-555555555555', 'Kits Festa', 'kits-festa', '💖', 'ativo', 5),
('c6666666-6666-6666-6666-666666666666', 'Datas Especiais', 'datas-especiais', '✨', 'ativo', 6)
ON CONFLICT (nome) DO NOTHING;

-- Inserir Produtos Iniciais
INSERT INTO public.produtos (categoria_id, nome, descricao, imagem, preco_inicio, destaque, status) VALUES
(
    'c5555555-5555-5555-5555-555555555555',
    'Kit Personalizado Safari 🦁',
    'Kit completo contendo 20 caixinhas variadas (Milk, Cone, Pyramide e Maletinha) com apliques 3D e laços de cetim premium no tema Safari.',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    35.00,
    true,
    'ativo'
),
(
    'c1111111-1111-1111-1111-111111111111',
    'Topo de Bolo 3D Luxo 🎂',
    'Topo de bolo personalizável em papel fotográfico 230g e lamicote dourado/prateado com camada 3D, nome, idade e elementos em relevo.',
    'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    28.00,
    true,
    'ativo'
),
(
    'c3333333-3333-3333-3333-333333333333',
    'Caneca de Porcelana Personalizada ☕',
    'Caneca de porcelana de alta qualidade 325ml com estampa sublimada durável. Personalizamos com fotos, nomes, frases e temas infantis.',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    32.00,
    true,
    'ativo'
),
(
    'c2222222-2222-2222-2222-222222222222',
    'Caixinha Milk Mágica Princesa 👑',
    'Caixa formato Milk personalizada com papel offset fosco 180g, fita de cetim e pedra strass. Ideal para rechear com guloseimas.',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    5.50,
    false,
    'ativo'
),
(
    'c4444444-4444-4444-4444-444444444444',
    'Lembrancinha Tubete com Aplique 3D ✨',
    'Tubete em acrílico 13cm com tampa colorida e aplique personalizado em papel fotográfico brilhante com o tema da sua festa.',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    4.20,
    false,
    'ativo'
),
(
    'c5555555-5555-5555-5555-555555555555',
    'Kit Pegue e Monte Infantil 🎨',
    'Kit prático contendo 30 peças vincadas e cortadas eletronicamente prontas para montagem simples. Acompanha fita banana e laços.',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    45.00,
    true,
    'ativo'
),
(
    'c6666666-6666-6666-6666-666666666666',
    'Kit Caixinhas Batizado Pompom 🕊️',
    'Conjunto delicado em tons anjo/pastéis com aplicação de anjinho em relevo, laço acetinado e tag de agradecimento personalizada.',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
    38.00,
    false,
    'ativo'
);
