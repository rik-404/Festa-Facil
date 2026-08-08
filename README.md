<p align="center">
  <img src="src/images/image.png" alt="Festa Fácil - Personalizados" width="520">
</p>

<h3 align="center">✨ Criamos • Personalizamos • Encantamos ✨</h3>

<p align="center">
  <img src="https://img.shields.io/badge/status-online-25D366?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" alt="JavaScript">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white" alt="Font Awesome">
</p>

---

## 📌 Sobre o Projeto

**Festa Fácil** é uma plataforma web moderna e elegante desenvolvida para uma empresa de papelaria personalizada localizada em **São Pedro/SP**, especializada em topos de bolo, canecas, caixinhas e mimos artesanais.

O sistema permite que os clientes naveguem pela vitrine de produtos, filtrem por categorias, façam buscas em tempo real e montem um **carrinho de orçamento direto pelo WhatsApp** — sem cadastro e sem burocracia. Também conta com um **Painel Administrativo completo** para gestão de produtos, categorias e configurações da loja.

---

## 🌟 Funcionalidades

### 🛍️ Vitrine Pública

| Recurso | Descrição |
| :--- | :--- |
| **Categorias Inteligentes** | Cards responsivos com ícones FontAwesome. Exibe apenas categorias com produtos ativos. |
| **Busca em Tempo Real** | Filtragem instantânea por nome ou descrição do produto. |
| **Ordenação** | Mais Populares, Menor Preço e Maior Preço. |
| **Carrinho de Orçamento** | Adição rápida de itens + envio direto via WhatsApp com mensagem formatada. |
| **WhatsApp Dinâmico** | Botão flutuante e botão Hero sincronizados com o número cadastrado no admin. |
| **SEO & Open Graph** | Meta tags otimizadas para compartilhamento no WhatsApp, Facebook e redes sociais. |

### ⚙️ Painel Administrativo

| Recurso | Descrição |
| :--- | :--- |
| **Dashboard** | Métricas de produtos, categorias ativas, visualizações e top 5 mais buscados. |
| **CRUD de Categorias** | Criar, editar, ativar/desativar e excluir com seletor de ícones interativo. |
| **CRUD de Produtos** | Cadastro completo com upload de imagem (Base64 ou URL), destaque e status. |
| **Configurações** | Nome da loja, slogan, cidade/estado e número do WhatsApp — com reflexo instantâneo no site. |

---

## 🏗️ Arquitetura & Banco de Dados

O sistema utiliza uma arquitetura **híbrida e resiliente**:

```
☁️  Supabase (PostgreSQL Cloud)  ←→  📱 Aplicação Web  ←→  💾 LocalStorage (Fallback Offline)
```

- **Supabase**: Sincronização em tempo real das tabelas `categorias`, `produtos` e `configuracoes`.
- **LocalStorage**: Backup automático offline — garante funcionamento mesmo sem internet.

---

## 📁 Estrutura do Projeto

```
Festa Fácil/
├── index.html                 # Vitrine pública da loja
├── README.md                  # Documentação do projeto
├── admin/
│   └── admin.html             # Painel Administrativo
├── sql/
│   └── schema.sql             # Script SQL (tabelas, RLS e seeds)
└── src/
    ├── images/
    │   ├── image.png           # Logo oficial da marca
    │   ├── image-removebg-preview.png  # Logo sem fundo (favicon)
    │   └── vendramini-icon.png # Ícone do desenvolvedor
    ├── js/
    │   ├── app.js              # Lógica da vitrine (filtros, carrinho, WhatsApp)
    │   ├── admin.js            # Lógica do painel admin (dashboard, CRUDs)
    │   └── db.js               # Camada de dados (Supabase + LocalStorage)
    └── styles/
        └── styles.css          # Estilização completa (CSS custom, HSL, animações)
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
| :--- | :--- |
| **HTML5** | Estrutura semântica e acessível |
| **CSS3 Vanilla** | Variáveis CSS, Grid, Flexbox, Glassmorphism e gradientes |
| **JavaScript ES6+** | Async/Await, Fetch API, DOM Manipulation |
| **Supabase JS v2** | Backend PostgreSQL em nuvem com RLS |
| **FontAwesome 6** | Ícones flat vetoriais |
| **Google Fonts** | Tipografia moderna e legível |

---

## 🚀 Como Executar

1. **Clone** o repositório:
   ```bash
   git clone https://github.com/rik-404/Festa-Facil.git
   ```

2. Abra o arquivo `index.html` no navegador para acessar a **vitrine pública**.

3. Acesse `admin/admin.html` para o **painel administrativo**.

> [!TIP]
> O sistema funciona inteiramente no front-end com Supabase como BaaS. Não é necessário instalar dependências ou rodar um servidor local.

---

## 📍 Localização

**Festa Fácil Personalizados** • São Pedro / SP

<p align="center">
  <a href="https://www.instagram.com/festa_facil_personalizados"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"></a>
  <a href="https://www.facebook.com/share/1CtrdxNyvJ/"><img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook"></a>
</p>

---

<p align="center">
  Desenvolvido por <strong><a href="https://vendraminiinformatica.com.br/">Vendramini Informática</a></strong> 💜
</p>
