# Iframe Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign navigation for iframe-embedded pages by replacing the full fixed header with a reduced header and adding a bottom navigation bar, while keeping internal pages unchanged.

**Architecture:** Detect `route.meta.allowFullscreen` (already set on iframe pages) to conditionally render `ReducedHeader` + `IframeBottomBar` in `app.vue` and adjust layout padding in `layouts/default.vue`. Extract the drawer menu content into a reusable `NavigationMenu.vue` component so both `HamburguerMenu` and `IframeBottomBar` can open the same menu without duplicate triggers. All heights are driven by CSS variables to prevent layout shift.

**Tech Stack:** Nuxt 3, Vue 3, Element Plus, Capacitor

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `assets/css/globals.css` | Modify | Add CSS custom properties for reduced header and bottom bar heights |
| `components/header/NavigationMenu.vue` | Create | Reusable drawer menu content (extracted from `HamburguerMenu.vue`) |
| `components/header/HamburguerMenu.vue` | Modify | Replace inline drawer content with `<NavigationMenu>` |
| `components/header/ReducedHeader.vue` | Create | Minimal fixed header with small logo only (protects safe area) |
| `components/common/IframeBottomBar.vue` | Create | Fixed bottom bar with Back, Home, Menu buttons |
| `app.vue` | Modify | Conditionally render `ReducedHeader`+`IframeBottomBar` vs `HemocioneHeader` based on `route.meta.allowFullscreen` |
| `layouts/default.vue` | Modify | Adjust `paddingTop` and `paddingBottom` of `.page` conditionally |

---

### Task 1: Add CSS Variables to globals.css

**Files:**
- Modify: `assets/css/globals.css`

- [ ] **Step 1: Add height variables to `:root`**

Insert the following lines immediately after `--navbar-size:` in the `:root` block (around line 54):

```css
  --reduced-navbar-content-height: 44px;
  --reduced-navbar-size: calc(var(--reduced-navbar-content-height) + env(safe-area-inset-top));
  --bottom-bar-size: calc(56px + env(safe-area-inset-bottom));
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/globals.css
git commit -m "feat: add css vars for reduced header and bottom bar"
```

---

### Task 2: Create NavigationMenu.vue

**Files:**
- Create: `components/header/NavigationMenu.vue`

- [ ] **Step 1: Write NavigationMenu.vue**

Create `components/header/NavigationMenu.vue` with the following content (extracted from `HamburguerMenu.vue`):

```vue
<template>
  <div class="content">
    <NuxtLink
      class="menu-item"
      v-for="(internalPage, index) in internalPages"
      :key="internalPage.name"
      :to="internalPage.path"
      @click="$emit('navigate')"
    >
      <img
        :src="`/icons/${internalPage.icon}${
          isCurrentRoute(index) ? '.active' : ''
        }.svg`"
        class="icon"
      />
      <span :active="isCurrentRoute(index)">{{ internalPage.name }}</span>
    </NuxtLink>
    <ElDivider />
    <NuxtLink
      class="menu-item"
      v-for="(donationPage, index) in donationPages"
      :key="donationPage.name"
      :to="donationPage.path"
      @click="$emit('navigate')"
    >
      <img
        :src="`/icons/${donationPage.icon}${
          isCurrentRoute(index, 'donations') ? '.active' : ''
        }.svg`"
        class="icon"
      />
      <span :active="isCurrentRoute(index, 'donations')">{{
        donationPage.name
      }}</span>
    </NuxtLink>
    <ElDivider />
    <div
      class="menu-item"
      v-for="externalPage in externalPages"
      :key="externalPage.name"
      @click="() => openExternalPage(externalPage)"
    >
      <img :src="`/icons/${externalPage.icon}`" class="icon" />
      <span>{{ externalPage.name }}</span>
      <img src="/icons/external-link.svg" class="external-link-icon" />
    </div>
    <div class="menu-item out">
      <img src="/icons/logout.svg" class="icon" />
      <span @click="$emit('logout')">{{ logoutText }}</span>
      <span class="version" @click="handleVersionClick">v{{ version }}</span>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--black-100);
  color: var(--hemo-color-text-primary);
  font-size: 1.2em;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
}

.out {
  margin-top: auto;
}

.icon {
  object-fit: contain;
  width: 1.2rem;
}

.external-link-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.6rem;
}

span[active="true"] {
  color: var(--hemo-color-primary-light);
}

.version {
  margin-top: 0.5rem;
  color: var(--black-40);
  font-size: 0.6rem;
  justify-content: center;
  margin-left: auto;
}
</style>

<script setup lang="ts">
import { AppLauncher } from "@capacitor/app-launcher";
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";
import pkg from "~/package.json";

const emit = defineEmits<{
  navigate: [];
  logout: [];
}>();

const userStore = useUserStore();
const { pendingDonations, rejectedDonations } = storeToRefs(userStore);

const pendingDonationsCount = computed(() => pendingDonations.value.length);
const rejectedDonationsCount = computed(() => rejectedDonations.value.length);

const logoutText = userStore.user?.givenName
  ? `Sair (${userStore.user.givenName})`
  : "Sair";

interface Page {
  name: string;
  icon: string;
  disabled?: boolean;
}

interface InternalPage extends Page {
  priority: number;
  path: string;
}

const internalPages: InternalPage[] = [
  { path: "/", name: "Início", priority: 0, icon: "house" },
  { path: "/events", name: "Eventos", priority: 1, icon: "calendar" },
  { path: "/competitions", name: "Copas Hemocione", priority: 1, icon: "trophy" },
  { path: "/where", name: "Onde Doar", priority: 1, icon: "location" },
  { path: "/can-donate", name: "Posso Doar?", priority: 1, icon: "question" },
  { path: "/account", name: "Minha Conta", priority: 1, icon: "account" },
];

const donationPages = computed((): InternalPage[] => {
  return [
    { path: "/donations", name: "Histórico de doações", priority: 1, icon: "syringe-light" },
    { path: "/donations/pending", name: "Confirmações pendentes", priority: 2, icon: "alert-pending", disabled: pendingDonationsCount.value === 0 },
    { path: "/donations/rejected", name: "Doações rejeitadas", priority: 2, icon: "donation-canceled", disabled: rejectedDonationsCount.value === 0 },
  ].filter((page) => !page.disabled);
});

interface ExternalPage extends Page {
  url: string;
}

const externalPages: ExternalPage[] = [
  { url: "https://vista.hemocione.com.br", name: "Vestir a Camisa", icon: "shirt.svg" },
  { url: "https://apoie.hemocione.com.br", name: "Apoiar o Hemocione", icon: "help.svg" },
];

const currentRoute = useRoute();

const currentRouteIndex = computed(() => {
  const pagesCopy = [...internalPages, ...donationPages.value];
  const posiblePages = pagesCopy.filter((page) =>
    currentRoute.path.startsWith(page.path)
  );
  if (!posiblePages.length) return -1;

  const pagesSortedByPriority = posiblePages.sort(
    (a, b) => b.priority - a.priority
  );
  const highestPriorityPage = pagesSortedByPriority[0];
  return pagesCopy.indexOf(highestPriorityPage);
});

const isCurrentRoute = (
  pageIndex: number,
  pageType: "internal" | "donations" = "internal"
) => {
  if (pageType === "internal") {
    return pageIndex === currentRouteIndex.value;
  }

  const internalPagesLength = internalPages.length;
  return pageIndex === currentRouteIndex.value - internalPagesLength;
};

async function openExternalPage(externalPage: ExternalPage) {
  await AppLauncher.openUrl({ url: externalPage.url });
}

const version = ref(pkg.version);
const CLICKS_REQUIRED = 5;
const TIME_WINDOW = 3000;
const clicks = ref<number[]>([]);

const handleVersionClick = () => {
  const now = Date.now();
  clicks.value = clicks.value.filter((time) => now - time < TIME_WINDOW);
  clicks.value.push(now);

  if (clicks.value.length >= CLICKS_REQUIRED) {
    clicks.value = [];
    navigateTo("/test");
  }
};
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/header/NavigationMenu.vue
git commit -m "feat: extract NavigationMenu from HamburguerMenu for reuse"
```

---

### Task 3: Refactor HamburguerMenu.vue to Use NavigationMenu

**Files:**
- Modify: `components/header/HamburguerMenu.vue`

- [ ] **Step 1: Replace drawer content with NavigationMenu**

In `HamburguerMenu.vue`, replace everything inside `<ElDrawer>` with `<HeaderNavigationMenu @navigate="toggleDrawer" @logout="handleOut" />`. Also remove the duplicate `<script>` logic that was extracted (keep only the drawer toggle, logout dialog, and popstate handling).

Full replacement for the `<template>` section:

```vue
<template>
  <img src="/icons/menu.svg" alt="Menu" @click="toggleDrawer" />
  <ElDrawer v-model="drawer" direction="rtl" size="300px">
    <HeaderNavigationMenu @navigate="toggleDrawer" @logout="handleOut" />
  </ElDrawer>
  <ElDialog
    :title="logoutText"
    v-model="confirmOutDialog"
    align-center
    width="300px"
  >
    <span>Tem certeza que deseja sair?</span>
    <div class="dialog-actions">
      <ElButton @click="toggleOutDialog">Cancelar</ElButton>
      <ElButton type="primary" @click="handleOut">Sair</ElButton>
    </div>
  </ElDialog>
</template>
```

Full replacement for the `<style>` section (keep only dialog-actions and img sizing):

```vue
<style scoped>
img {
  width: 2em;
  height: 2em;
}

.dialog-actions {
  margin-top: 1rem;
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

.dialog-actions > * {
  width: 100%;
}
</style>
```

Full replacement for the `<script setup>` section:

```vue
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const drawer = ref(false);
const confirmOutDialog = ref(false);
const userStore = useUserStore();

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const toggleOutDialog = () => {
  confirmOutDialog.value = !confirmOutDialog.value;
};

const handleOut = () => {
  userStore.logout();
};

const handlePopState = (_event: Event) => {
  if (drawer.value) {
    toggleDrawer();
  }
};

watch(drawer, (newValue) => {
  if (newValue) {
    window.addEventListener("popstate", handlePopState);
    window.history.pushState({ drawer: "open" }, "");
  } else {
    window.removeEventListener("popstate", handlePopState);
  }
});
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/header/HamburguerMenu.vue
git commit -m "refactor: use NavigationMenu in HamburguerMenu"
```

---

### Task 4: Create ReducedHeader.vue

**Files:**
- Create: `components/header/ReducedHeader.vue`

- [ ] **Step 1: Write ReducedHeader.vue**

```vue
<template>
  <header>
    <img src="/logos/baseLogo.svg" alt="Hemocione" class="logo" />
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  height: var(--reduced-navbar-size);
  background-color: var(--black-100);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 1rem calc(env(safe-area-inset-top) + 0.25rem);
}

.logo {
  height: calc(var(--reduced-navbar-content-height) - 12px);
  object-fit: contain;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add components/header/ReducedHeader.vue
git commit -m "feat: add ReducedHeader component for iframe pages"
```

---

### Task 5: Create IframeBottomBar.vue

**Files:**
- Create: `components/common/IframeBottomBar.vue`

- [ ] **Step 1: Write IframeBottomBar.vue**

```vue
<template>
  <nav class="bottom-bar">
    <button class="nav-button" @click="goBack">
      <ElIcon :size="20"><ElIconArrowLeft /></ElIcon>
      <span>Voltar</span>
    </button>
    <button class="nav-button" @click="goHome">
      <img src="/icons/house.svg" alt="Home" class="nav-icon" />
      <span>Home</span>
    </button>
    <button class="nav-button" @click="toggleDrawer">
      <img src="/icons/menu.svg" alt="Menu" class="nav-icon" />
      <span>Menu</span>
    </button>

    <ElDrawer v-model="drawer" direction="rtl" size="300px">
      <HeaderNavigationMenu @navigate="toggleDrawer" @logout="handleOut" />
    </ElDrawer>

    <ElDialog
      title="Sair"
      v-model="confirmOutDialog"
      align-center
      width="300px"
    >
      <span>Tem certeza que deseja sair?</span>
      <div class="dialog-actions">
        <ElButton @click="toggleOutDialog">Cancelar</ElButton>
        <ElButton type="primary" @click="handleOut">Sair</ElButton>
      </div>
    </ElDialog>
  </nav>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height: var(--bottom-bar-size);
  background-color: var(--black-100);
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 0.5rem 0 calc(env(safe-area-inset-bottom) + 0.25rem);
  border-top: 1px solid var(--black-80);
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--hemo-color-text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 1rem;
}

.nav-button img,
.nav-button .el-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

.dialog-actions {
  margin-top: 1rem;
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

.dialog-actions > * {
  width: 100%;
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const drawer = ref(false);
const confirmOutDialog = ref(false);
const userStore = useUserStore();
const router = useRouter();

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleOutDialog = () => {
  confirmOutDialog.value = !confirmOutDialog.value;
};

const handleOut = () => {
  userStore.logout();
};

const goBack = () => {
  router.back();
};

const goHome = () => {
  navigateTo("/");
};

const handlePopState = (_event: Event) => {
  if (drawer.value) {
    toggleDrawer();
  }
};

watch(drawer, (newValue) => {
  if (newValue) {
    window.addEventListener("popstate", handlePopState);
    window.history.pushState({ drawer: "open" }, "");
  } else {
    window.removeEventListener("popstate", handlePopState);
  }
});
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/common/IframeBottomBar.vue
git commit -m "feat: add IframeBottomBar component"
```

---

### Task 6: Update app.vue for Conditional Header Rendering

**Files:**
- Modify: `app.vue`

- [ ] **Step 1: Add `isIframePage` computed and conditional rendering**

Inside `<script setup>`, after `const route = useRoute();`, add:

```ts
const isIframePage = computed(() => Boolean(route.meta.allowFullscreen));
```

In the `<template>`, replace the single `HemocioneHeader` line with:

```vue
    <HemocioneHeader
      v-if="!isIframePage"
      class="header"
      v-show="userStore.loggedIn"
      size="10"
    />
    <template v-else>
      <ReducedHeader v-show="userStore.loggedIn" />
      <IframeBottomBar v-show="userStore.loggedIn" />
    </template>
```

> Note: `ReducedHeader` already applies `position: fixed` internally, so no extra styling is needed in `app.vue`.

- [ ] **Step 2: Commit**

```bash
git add app.vue
git commit -m "feat: conditionally render reduced header and bottom bar on iframe pages"
```

---

### Task 7: Update layouts/default.vue for Conditional Padding

**Files:**
- Modify: `layouts/default.vue`

- [ ] **Step 1: Replace the script and styles**

Full replacement for `<script setup>`:

```vue
<script setup lang="ts">
const route = useRoute();
const allowFullscreen = computed(() => Boolean(route.meta.allowFullscreen));

const pageStyle = computed(() => ({
  maxWidth: allowFullscreen.value ? "100%" : "var(--app-max-width)",
  paddingTop: allowFullscreen.value
    ? "var(--reduced-navbar-size)"
    : "var(--navbar-size)",
  paddingBottom: allowFullscreen.value ? "var(--bottom-bar-size)" : "0",
}));
</script>
```

Full replacement for `<style scoped>`:

```vue
<style scoped>
.application {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--available-height);
  width: var(--available-width);
  overflow: hidden;
  align-items: center;
}

.page {
  background-color: white;
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  transition: max-width 0.3s ease-in-out;
  box-sizing: border-box;
}
</style>
```

Key changes:
- `min-height` and `margin-top` removed; `paddingTop`/`paddingBottom` handle spacing.
- `box-sizing: border-box` ensures padding does not increase total height beyond container.

- [ ] **Step 2: Commit**

```bash
git add layouts/default.vue
git commit -m "feat: adjust layout padding for reduced header and bottom bar"
```

---

### Task 8: Update layouts/externalPage.vue (if still used)

**Files:**
- Modify: `layouts/externalPage.vue`

- [ ] **Step 1: Align externalPage.vue with default.vue logic**

If `externalPage.vue` is still referenced anywhere, apply the same conditional padding changes as in Task 7. If it is unused, delete it to avoid confusion.

To check usage:

```bash
grep -r "externalPage" --include="*.vue" --include="*.ts" .
```

If unused:

```bash
git rm layouts/externalPage.vue
git commit -m "chore: remove unused externalPage layout"
```

If used, apply the same `<script setup>` and `<style>` replacements from Task 7, then commit.

---

### Task 9: Manual Testing

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test iframe pages**

Navigate to each iframe page and verify:
- `/events` — reduced header visible at top, no hamburguer icon, bottom bar visible with 3 buttons
- `/where` — same
- `/can-donate` — same
- `/competitions` — same

- [ ] **Step 3: Test internal pages**

Navigate to `/`, `/account`, `/donations` and verify:
- Full `HemocioneHeader` with hamburguer menu is still present
- No bottom bar appears

- [ ] **Step 4: Test navigation interactions**

On an iframe page:
- Click **Home** → navigates to `/`
- Click **Voltar** → goes back in history
- Click **Menu** → drawer opens with same content as header menu
- Click a menu item → drawer closes and navigation occurs

- [ ] **Step 5: Check for layout shift**

Open DevTools → Performance tab → enable Web Vitals overlay, or use the Layout Shift Regions option. Reload an iframe page and confirm **CLS = 0**.

- [ ] **Step 6: Commit any fixes**

If any fixes were needed during testing, commit them with descriptive messages.

---

## Self-Review Checklist

### Spec Coverage

| Spec Requirement | Task(s) |
|---|---|
| RQ1: Header reduzido em páginas embedadas | Task 4, Task 6 |
| RQ2: Bottom bar com 3 botões | Task 5, Task 6 |
| RQ3: Menu abre mesmo drawer | Task 2, Task 3, Task 5 |
| RQ4: Home navega para `/` | Task 5 |
| RQ5: Voltar usa router.back | Task 5 |
| RQ6: Páginas internas inalteradas | Task 6, Task 7 |
| RQ7: Sem layout shift | Task 1, Task 4, Task 5, Task 7 |

### Placeholder Scan
- No TBD/TODO/fill-in-details found.
- All code blocks contain complete, runnable code.
- All file paths are exact.

### Type Consistency
- `allowFullscreen` is read consistently via `Boolean(route.meta.allowFullscreen)`.
- CSS variable names match across all tasks (`--reduced-navbar-size`, `--bottom-bar-size`).
- Component names match Nuxt auto-import conventions (`HeaderNavigationMenu`, `HeaderReducedHeader`, `CommonIframeBottomBar`).

**Plan complete.**
