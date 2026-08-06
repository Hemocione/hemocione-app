# 🩸 Hemocione App

Aplicação web mobile-first para doadores de sangue do ecossistema **Hemocione**. O app permite que doadores acompanhem seu histórico de doações, registrem novas doações, verifiquem sua elegibilidade para doar, acessem eventos e competições, e gerenciem seu perfil de doador.

> **Para quem é?** Doadores de sangue cadastrados na plataforma Hemocione que desejam acompanhar e registrar sua jornada de doação de forma simples e acessível.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia |
|---|---|
| Framework Web | [Nuxt 3](https://nuxt.com) (Vue 3, SPA mode) |
| App Mobile | [Capacitor 7](https://capacitorjs.com) (iOS & Android) |
| UI Components | [Element Plus](https://element-plus.org) |
| Estado Global | [Pinia](https://pinia.vuejs.org) |
| Utilitários Vue | [VueUse](https://vueuse.org) |
| Animações | [@formkit/auto-animate](https://auto-animate.formkit.com) |
| Fontes | Google Fonts (Lato) |
| Analytics | [PostHog](https://posthog.com) |
| Push Notifications | [OneSignal](https://onesignal.com) |
| Datas | [Day.js](https://day.js.org) |
| Máscaras de Input | [Maska](https://beholdr.github.io/maska) |
| Deploy | [Vercel](https://vercel.com) |
| Linguagem | TypeScript |
| Gerenciador de Pacotes | Yarn |

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.x ([download](https://nodejs.org))
- **Yarn** >= 1.22.x (`npm install -g yarn`)
- **Git**

Para desenvolvimento mobile (opcional):
- **Xcode** (para iOS, apenas macOS)
- **Android Studio** (para Android)
- **Capacitor CLI** (`npm install -g @capacitor/cli`)

---

## 🚀 Instalação e Setup

### 1. Clone o repositório

```bash
git clone https://github.com/hemocione/hemocione-app.git
cd hemocione-app
```

### 2. Instale as dependências

```bash
yarn
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ID do app no OneSignal (notificações push)
NUXT_ONE_SIGNAL_APP_ID=

# Domínio do cookie de autenticação (padrão: hemocione.com.br)
NUXT_COOKIE_DOMAIN=hemocione.com.br

# URL da API de autenticação Hemocione ID
NUXT_HEMOCIONE_ID_API_URL=https://hemocione-id.cpt.hemocione.com.br

# URL do portal de autenticação Hemocione ID
NUXT_HEMOCIONE_ID_URL=https://id.hemocione.com.br

# Chave local para armazenamento do token de autenticação
NUXT_AUTH_LOCAL_KEY=hemocioneId

# URL da plataforma de eventos
NUXT_EVENTS_URL=https://eventos.hemocione.com.br

# URL da plataforma de competições
NUXT_COMPETITIONS_URL=https://copa.hemocione.com.br

# URL do localizador de bancos de sangue
NUXT_WHERE_TO_DONATE_URL=https://ondedoar.hemocione.com.br

# URL do verificador de elegibilidade para doação
NUXT_CAN_DONATE_URL=https://possodoar.hemocione.com.br

# Chave pública do PostHog (analytics)
NUXT_POSTHOG_PUBLIC_KEY=

# Host do PostHog
NUXT_POSTHOG_HOST=https://us.i.posthog.com
```

> **Nota:** Todas as variáveis têm valores padrão apontando para os ambientes de produção/staging. Para desenvolvimento local básico, o `.env` pode ser omitido.

---

## 💻 Rodando Localmente

### Servidor de desenvolvimento

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Build de produção

```bash
yarn build
```

### Preview do build de produção

```bash
yarn preview
```

### Geração estática (para Capacitor)

```bash
yarn generate
```

---

## 📱 Desenvolvimento Mobile (Capacitor)

O app pode ser compilado como aplicativo nativo para iOS e Android via Capacitor.

### Sincronizar com as plataformas nativas

```bash
yarn capacitor:sync
```

### Abrir no Xcode (iOS)

```bash
yarn capacitor:open:ios
```

### Abrir no Android Studio

```bash
yarn capacitor:open:android
```

### Gerar ícones e splash screens

```bash
yarn capacitor:generate-image-assets
```

> Os assets de origem devem estar na pasta `resources/`.

---

## 🗂️ Estrutura do Projeto

```
hemocione-app/
├── assets/              # Estilos globais (CSS)
│   └── css/
│       ├── globals.css
│       ├── transitions.css
│       └── animations.css
├── components/          # Componentes Vue reutilizáveis
│   ├── account/         # Componentes de conta do usuário
│   ├── common/          # Componentes genéricos (botões, headers, etc.)
│   ├── donation/        # Componentes de doação (card, listagem, etc.)
│   ├── header/          # Componentes de cabeçalho
│   ├── user/            # Componentes de perfil do usuário
│   ├── HemocioneHeader.vue
│   └── RegisterDonationFooter.vue
├── composables/         # Composables Vue (lógica reutilizável)
│   ├── usePersistentIframe.ts
│   ├── usePosthog.ts
│   └── useTopSafeAreaInset.ts
├── layouts/             # Layouts de página
│   ├── default.vue      # Layout padrão (com navbar)
│   └── externalPage.vue # Layout para páginas externas (iframe)
├── pages/               # Rotas da aplicação (file-based routing)
│   ├── index.vue        # Home — resumo do doador
│   ├── account/         # Perfil e exclusão de conta
│   ├── donations/       # Histórico e registro de doações
│   ├── can-donate/      # Verificador de elegibilidade
│   ├── events/          # Eventos de doação
│   ├── competitions/    # Competições
│   ├── where/           # Locais para doação
│   └── support.vue      # Suporte
├── plugins/             # Plugins Nuxt (OneSignal, PostHog, etc.)
├── public/              # Arquivos públicos estáticos
├── resources/           # Assets para geração de ícones (Capacitor)
├── server/              # Rotas de servidor (Nuxt server routes)
├── stores/              # Stores Pinia
│   ├── user.ts          # Estado do usuário e doações
│   └── bloodBanks.ts    # Lista de bancos de sangue
├── utils/               # Funções utilitárias
├── android/             # Projeto nativo Android (Capacitor)
├── ios/                 # Projeto nativo iOS (Capacitor)
├── app.vue              # Componente raiz
├── nuxt.config.ts       # Configuração do Nuxt
└── capacitor.config.json # Configuração do Capacitor
```

### Principais rotas

| Rota | Descrição |
|---|---|
| `/` | Home — perfil resumido e status de elegibilidade |
| `/donations` | Histórico de doações |
| `/donations/new` | Registrar nova doação |
| `/account` | Editar perfil do usuário |
| `/account/delete` | Exclusão de conta |
| `/events/[...]` | Eventos de doação (iframe) |
| `/competitions/[...]` | Competições (iframe) |
| `/where/[...]` | Mapa de locais para doar (iframe) |
| `/can-donate/[...]` | Verificar elegibilidade (iframe) |
| `/support` | Suporte ao usuário |

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b feat/minha-feature
   ```
3. Faça suas alterações seguindo os padrões do projeto (TypeScript, Vue 3 Composition API)
4. Commit com mensagem descritiva seguindo [Conventional Commits](https://www.conventionalcommits.org/pt-br):
   ```bash
   git commit -m "feat: adiciona novo componente de doação"
   ```
5. Abra um Pull Request descrevendo suas alterações

### Padrões de branch

| Prefixo | Uso |
|---|---|
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `docs/` | Documentação |
| `refactor/` | Refatoração de código |
| `chore/` | Tarefas de manutenção |

---

## 📄 Licença

Este projeto não possui um arquivo de licença explícito. Para uso, distribuição ou contribuição, entre em contato com a equipe Hemocione.

---

<p align="center">
  Feito com ❤️ pela equipe <a href="https://hemocione.com.br">Hemocione</a> — ajudando a salvar vidas, uma doação de cada vez.
</p>
