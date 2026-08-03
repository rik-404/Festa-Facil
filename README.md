# 💖 Festa Fácil - Vitrine & Catálogo de Orçamentos

Uma plataforma web moderna, elegante e de alta performance desenvolvida para a **Festa Fácil** (São Pedro/SP), especializada em papelaria personalizada, topos de bolo, canecas e mimos artesanais.

O projeto permite que clientes naveguem pelo catálogo, filtrem produtos por categorias ativas, façam buscas em tempo real e enviem um **orçamento direto para o WhatsApp** da vendedora sem burocracias. Além disso, conta com um **Painel Administrativo completo** para gestão do catálogo e configurações.

---

## 🌟 Funcionalidades Principais

### 🛍️ Vitrine do Cliente (`index.html` & `app.js`)
- **Navegação Inteligente de Categorias**: Cards responsivos com ícones Flat FontAwesome e tooltips informativos. Exibe dinamicamente apenas categorias que possuem produtos ativos cadastrados.
- **Busca e Ordenação em Tempo Real**:
  - Filtro por texto (nome ou descrição do produto).
  - Ordenação por: *Mais Populares (Visualizações)*, *Menor Preço* e *Maior Preço*.
- **Carrinho de Orçamento sem Compromisso**:
  - Adição rápida de itens ao carrinho.
  - Coleta simples de dados do cliente (Nome e Bairro/Cidade).
  - **Integração com WhatsApp**: Monta uma mensagem detalhada e organizada com a lista de itens e dados do cliente, abrindo o bate-papo diretamente com o número configurado.
- **Botões Dinâmicos do WhatsApp**: Tanto o botão flutuante quanto o botão da seção Hero são sincronizados automaticamente com o número de contato cadastrado no painel administrativo.
- **Identidade Visual & Compartilhamento (SEO & Open Graph)**: Configurado com meta tags Open Graph e Twitter Cards para que o link da loja apareça com título profissional, descrição atraente e prévia da imagem oficial quando compartilhado no WhatsApp, Facebook e redes sociais.

---

### ⚙️ Painel Administrativo (`admin.html` & `admin.js`)
- **Dashboard com Métricas**:
  - Total de produtos cadastrados.
  - Total de categorias ativas.
  - Contagem total de visualizações de produtos.
  - Tabela dos 5 produtos mais procurados.
- **Gestão de Categorias (CRUD)**:
  - Criação e edição com seletor interativo de ícones Flat FontAwesome.
  - Ativação/Desativação de categorias.
  - Exclusão com confirmação.
- **Gestão de Produtos (CRUD)**:
  - Cadastro completo (Nome, Categoria, Preço Inicial, Descrição e Imagem).
  - Upload de foto do computador (via FileReader/Base64) ou URL externa.
  - Opção de marcar produto em **Destaque na Vitrine**.
  - Controle de status (Ativo/Inativo).
- **Configurações da Empresa**:
  - Alteração do Nome da Loja, Slogan, Cidade/Estado e **Número do WhatsApp**.
  - As atualizações do número refletem instantaneamente nos botões de atendimento do site.

---

## 🗄️ Estrutura do Banco de Dados & Arquitetura

O sistema adota uma arquitetura **híbrida e resiliente** via `db.js`:
1. **Supabase PostgreSQL Cloud**: Sincronização em tempo real das tabelas `categorias`, `produtos` e `configuracoes`.
2. **LocalStorage Fallback**: Backup offline automático em caso de desconexão ou indisponibilidade de rede.

### 📁 Tabela de Arquivos do Projeto

| Arquivo | Descrição |
| :--- | :--- |
| [`index.html`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/index.html) | Interface pública da loja (Vitrine, Hero, Categorias e Drawer do Carrinho). |
| [`app.js`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/app.js) | Lógica da vitrine (Filtros, busca, ordenação, carrinho e disparo do WhatsApp). |
| [`admin.html`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/admin.html) | Interface do Painel Administrativo em layout de Sidebar lateral. |
| [`admin.js`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/admin.js) | Lógica do Backoffice (Dashboard, CRUD de categorias, CRUD de produtos e configurações). |
| [`db.js`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/db.js) | Camada de acesso a dados (Supabase Client + LocalStorage Backup). |
| [`styles.css`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/styles.css) | Estilização completa com CSS customizado, temas de cores HSL, responsividade e animações. |
| [`schema.sql`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/schema.sql) | Script SQL para criação das tabelas, políticas de segurança (RLS) e dados iniciais no Supabase. |

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3 Vanilla** (Variáveis CSS, CSS Grid, Flexbox, Glassmorphism e gradientes).
- **JavaScript (ES6+)** (Async/Await, Fetch API, DOM Manipulation).
- **FontAwesome 6** (Ícones flat vetoriais).
- **Supabase JS Client v2** (Autenticação e Database PostgreSQL).
- **Google Fonts** (Tipografia moderna e legível).

---

## 🚀 Como Executar o Projeto

1. Clone o repositório ou abra a pasta do projeto no servidor web/navegador.
2. Abra o arquivo [`index.html`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/index.html) no navegador para acessar a vitrine pública.
3. Para acessar o painel administrativo, abra [`admin.html`](file:///media/ricardo/7AEE-1816/Sites/Festa%20Facil/admin.html) no navegador.

---

### 📍 Localização
**Festa Fácil** • São Pedro / SP
