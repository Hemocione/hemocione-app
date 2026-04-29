# Design: Navegação para Páginas Embedadas (Iframes)

**Data:** 2026-04-29  
**Status:** Aprovado  
**Autor:** OpenCode (com colaboração do usuário)

---

## 1. Contexto

O aplicativo Hemocione utiliza páginas embedadas (iframes) para serviços externos: Eventos, Onde Doar, Posso Doar? e Copas Hemocione. O header fixo (`HemocioneHeader`) ocupa o topo da tela e interfere no espaço disponível para esses iframes. Além disso, como os apps embedados já possuem seus próprios menus internos, o header hamburguer do wrapper acaba sendo redundante e visualmente confuso.

## 2. Objetivo

Redesenhar a navegação para páginas embedadas, removendo o header completo e introduzindo uma bottom bar com navegação essencial, enquanto preserva a proteção da safe area do Capacitor e evita layout shift.

## 3. Requisitos

- **RQ1:** Páginas embedadas devem exibir um **header reduzido** (apenas logo Hemocione, sem menu hamburguer), fixo no topo, para proteger a safe area.
- **RQ2:** Páginas embedadas devem exibir uma **bottom bar** fixa na base com botões: **Voltar**, **Home** e **Menu**.
- **RQ3:** O botão **Menu** na bottom bar deve abrir o **mesmo drawer lateral** (`HamburguerMenu`) já existente no app.
- **RQ4:** O botão **Home** deve navegar para `/`.
- **RQ5:** O botão **Voltar** deve executar a navegação de volta.
- **RQ6:** Páginas internas (não embedadas) devem manter o `HemocioneHeader` atual **sem alterações**.
- **RQ7:** **Não pode haver layout shift (CLS)** durante a transição entre modos de navegação.

## 4. Decisões de Arquitetura

### 4.1 Abordagem Escolhida: Layout Default Condicional (Abordagem B)

As páginas embedadas já utilizam `definePageMeta({ allowFullscreen: true })`. Aproveitamos essa meta existente para alternar a interface de navegação diretamente no `layouts/default.vue` e no `app.vue`.

**Motivo:** Centralizado, reutiliza sinalizador existente, não exige edição de cada página embedada, mantém o código DRY.

### 4.2 Componentes

| Componente | Local | Descrição |
|---|---|---|
| `ReducedHeader.vue` | `components/header/ReducedHeader.vue` | Header mínimo fixo no topo. Apenas logo Hemocione. Altura: `44px` de conteúdo + `env(safe-area-inset-top)`. |
| `IframeBottomBar.vue` | `components/common/IframeBottomBar.vue` | Barra fixa na base. 3 botões (Voltar, Home, Menu). Altura: `56px` + `env(safe-area-inset-bottom)`. |
| `HamburguerMenu.vue` | `components/header/HamburguerMenu.vue` | **Reutilizado**. O drawer lateral continua o mesmo. |

### 4.3 Modificações em Arquivos Existentes

| Arquivo | Alteração |
|---|---|
| `app.vue` | Condicionalmente renderizar `ReducedHeader` + `IframeBottomBar` (quando `allowFullscreen`) ou `HemocioneHeader` (padrão). |
| `layouts/default.vue` | Ajustar `padding-top` e `padding-bottom` da `.page` de forma condicional com base em `allowFullscreen`. |
| `assets/css/globals.css` | Adicionar CSS variables: `--reduced-navbar-content-height`, `--reduced-navbar-size`, `--bottom-bar-size`. |

## 5. Prevenção de Layout Shift (CLS)

1. **`route.meta.allowFullscreen` é conhecido sincronamente** — definido em build time via `definePageMeta`.
2. **`app.vue` e `default.vue` calculam o modo no mesmo tick de renderização** — o DOM é pintado com as dimensões corretas desde o primeiro frame.
3. **Alturas são fixas e definidas por CSS variables** — nunca há estado intermediário de altura zero ou indefinido.
4. **Transições (opcional futuro)** — se adicionadas, devem transicionar entre dois valores fixos conhecidos, nunca de `auto` ou valores dinâmicos dependentes de medição.

## 6. Detalhes de Implementação

### 6.1 CSS Variables (globals.css)

```css
:root {
  /* ... existing variables ... */
  --reduced-navbar-content-height: 44px;
  --reduced-navbar-size: calc(var(--reduced-navbar-content-height) + env(safe-area-inset-top));
  --bottom-bar-size: calc(56px + env(safe-area-inset-bottom));
}
```

### 6.2 app.vue

```vue
<!-- Pseudocódigo -->
<template>
  <ElConfigProvider :locale="ptBr">
    <template v-if="!isIframePage">
      <HemocioneHeader class="header" v-show="userStore.loggedIn" size="10" />
    </template>
    <template v-else>
      <ReducedHeader class="reduced-header" v-show="userStore.loggedIn" />
    </template>

    <NuxtLayout v-if="userStore.loggedIn">
      <div id="iframe-page-wrapper" style="display: none" />
      <NuxtPage />
    </NuxtLayout>
    <!-- ... login wrapper ... -->
  </ElConfigProvider>
</template>

<script setup>
const route = useRoute();
const isIframePage = computed(() => Boolean(route.meta.allowFullscreen));
</script>
```

### 6.3 layouts/default.vue

```vue
<!-- Pseudocódigo -->
<script setup>
const route = useRoute();
const isIframePage = computed(() => Boolean(route.meta.allowFullscreen));

const pageStyle = computed(() => ({
  maxWidth: isIframePage.value ? '100%' : 'var(--app-max-width)',
  paddingTop: isIframePage.value ? 'var(--reduced-navbar-size)' : 'var(--navbar-size)',
  paddingBottom: isIframePage.value ? 'var(--bottom-bar-size)' : '0',
}));
</script>
```

### 6.4 IframeBottomBar.vue — Ações

| Botão | Ação |
|---|---|
| Voltar | `useRouter().back()` |
| Home | `navigateTo('/')` |
| Menu | Emite evento ou abre drawer (reutiliza `HamburguerMenu`) |

## 7. Testes

### 7.1 Testes Manuais (obrigatórios)

1. Abrir cada página embedada (`/events`, `/where`, `/can-donate`, `/competitions`).
2. Verificar: header reduzido aparece no topo, sem menu hamburguer.
3. Verificar: bottom bar aparece na base com 3 botões.
4. Verificar: **nenhum layout shift** no carregamento inicial (inspecionar via DevTools > Performance > CLS).
5. Verificar: botão Home leva para `/`.
6. Verificar: botão Menu abre o drawer com as mesmas opções do header normal.
7. Navegar de uma página interna (`/`) para uma embedada e vice-versa — verificar alternância correta.
8. Testar em dispositivo/simulador com notch — verificar safe areas.

## 8. Escopo

### Inclui
- Criação de `ReducedHeader.vue`
- Criação de `IframeBottomBar.vue`
- Modificação condicional de `app.vue`
- Modificação condicional de `layouts/default.vue`
- Adição de CSS variables em `globals.css`

### Inclui (continuação)
- Refatoração leve de `HamburguerMenu.vue`: extrair o conteúdo do drawer (`ElDrawer`) para um componente reutilizável (ex: `MenuDrawer.vue`) ou tornar o trigger opcional via prop, permitindo que `IframeBottomBar` abra o mesmo drawer sem renderizar o ícone de menu duplicado.

### Não Inclui
- Alterações nas páginas embedadas (`events`, `where`, etc.)
- Alterações em páginas internas
- Testes automatizados (fora do escopo atual)

## 9. Notas

- O `externalPage.vue` layout também possui `margin-top: var(--navbar-size)`. Deve ser avaliado se ele também precisa do tratamento condicional ou se está obsoleto.
- O `Capacitor` protege a dead zone no topo — por isso o header reduzido continua sendo necessário, mesmo em páginas embedadas.
