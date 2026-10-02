export type AvatarSlot = "OLHOS" | "CORPO" | "PERNAS" | "ACESSORIOS" | "FUNDO";
export type AvatarTab = AvatarSlot | "SELO";

export const REQUIRED_AVATAR_SLOTS: AvatarSlot[] = ["OLHOS", "CORPO", "PERNAS"];

export interface AvatarItem {
  id: number;
  key: string;
  name: string;
  slot: AvatarSlot;
  assetRef: string;
  isDefault: boolean;
  owned: boolean;
  seenAt: string | null;
}

export interface AvatarEquipped {
  olhosItemId: number | null;
  corpoItemId: number | null;
  pernasItemId: number | null;
  acessoriosItemId: number | null;
  fundoItemId: number | null;
}

export interface BloodTypeBadge {
  bloodType: string;
  assetRef: string;
}

export interface AchievementRewardItem {
  id: number | null;
  key: string;
  name: string;
  slot: AvatarSlot | "BADGE";
  assetRef: string;
}

export interface Achievement {
  id: number;
  key: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: { current: number; target: number } | null;
  rewardItem: AchievementRewardItem | null;
}

const SLOT_TO_FIELD: Record<AvatarSlot, keyof AvatarEquipped> = {
  OLHOS: "olhosItemId",
  CORPO: "corpoItemId",
  PERNAS: "pernasItemId",
  ACESSORIOS: "acessoriosItemId",
  FUNDO: "fundoItemId",
};

const avatarRequests = new WeakMap<object, Promise<void>>();

export const useAvatarStore = defineStore("avatar", {
  state: () => ({
    items: [] as AvatarItem[],
    equipped: null as AvatarEquipped | null,
    bloodTypeBadge: null as BloodTypeBadge | null,
    achievements: [] as Achievement[],
    isEditorOpen: false,
    activeTab: "OLHOS" as AvatarTab,
    showBloodTypeBadge: true,
    pendingEquipItemId: null as number | null,
    isLoadingAvatar: false,
    avatarLoaded: false,
    avatarError: "",
    isLoadingAchievements: false,
    achievementsLoaded: false,
    achievementsError: "",
    isSaving: false,
    saveError: "",
  }),
  actions: {
    async fetchAvatar() {
      if (this.avatarLoaded) return;
      const existingRequest = avatarRequests.get(this);
      if (existingRequest) return existingRequest;
      this.isLoadingAvatar = true;
      this.avatarError = "";
      const config = useRuntimeConfig();
      const userStore = useUserStore();
      const request = (async () => {
        try {
          const data = await $fetch<{
            items: AvatarItem[];
            equipped: AvatarEquipped;
            bloodTypeBadge: BloodTypeBadge | null;
            showBloodTypeBadge?: boolean;
          }>(config.public.hemocioneIdApiUrl + "/users/me/avatar", {
            headers: { Authorization: `Bearer ${userStore.token}` },
          });
          this.items = data.items;
          this.equipped = data.equipped;
          this.bloodTypeBadge = data.bloodTypeBadge;
          this.showBloodTypeBadge =
            data.showBloodTypeBadge ?? data.bloodTypeBadge !== null;
          this.avatarLoaded = true;
        } catch {
          this.avatarError =
            "Não foi possível carregar seu Hemárcio. Tente novamente.";
        } finally {
          this.isLoadingAvatar = false;
          avatarRequests.delete(this);
        }
      })();
      avatarRequests.set(this, request);
      await request;
    },
    async fetchAchievements() {
      if (this.achievementsLoaded || this.isLoadingAchievements) return;
      this.isLoadingAchievements = true;
      this.achievementsError = "";
      const config = useRuntimeConfig();
      const userStore = useUserStore();
      try {
        this.achievements = await $fetch<Achievement[]>(
          config.public.hemocioneIdApiUrl + "/users/me/achievements",
          { headers: { Authorization: `Bearer ${userStore.token}` } },
        );
        this.achievementsLoaded = true;
      } catch {
        this.achievementsError =
          "Não foi possível carregar suas conquistas. Tente novamente.";
      } finally {
        this.isLoadingAchievements = false;
      }
    },
    async saveAvatar(
      patch: Partial<AvatarEquipped> & { showBloodTypeBadge?: boolean },
    ) {
      if (this.isSaving) return;
      this.isSaving = true;
      this.saveError = "";
      const config = useRuntimeConfig();
      const userStore = useUserStore();
      try {
        const data = await $fetch<AvatarEquipped>(
          config.public.hemocioneIdApiUrl + "/users/me/avatar",
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${userStore.token}` },
            body: patch,
          },
        );
        this.equipped = data;
        if (patch.showBloodTypeBadge !== undefined) {
          this.showBloodTypeBadge = patch.showBloodTypeBadge;
        }
      } catch {
        this.saveError =
          "Não foi possível salvar. Sua seleção anterior foi mantida. Tente novamente.";
      } finally {
        this.isSaving = false;
      }
    },
    async equipItem(item: AvatarItem) {
      if (!item.owned || !this.equipped) return;
      await this.saveAvatar({ [SLOT_TO_FIELD[item.slot]]: item.id });
    },
    async unequipItem(slot: AvatarSlot) {
      if (!this.equipped || REQUIRED_AVATAR_SLOTS.includes(slot)) return;
      await this.saveAvatar({ [SLOT_TO_FIELD[slot]]: null });
    },
    async toggleBloodTypeBadge() {
      await this.saveAvatar({ showBloodTypeBadge: !this.showBloodTypeBadge });
    },
    async markItemsSeen(ids?: number[]) {
      if (this.items.length === 0) await this.fetchAvatar();

      const itemIds = this.unseenItems
        .filter((item) => !ids || ids.includes(item.id))
        .map((item) => item.id);
      if (itemIds.length === 0) return;

      const config = useRuntimeConfig();
      const userStore = useUserStore();

      await $fetch<{ updated: number }>(
        config.public.hemocioneIdApiUrl + "/users/me/items/seen",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemIds }),
        },
      );

      const seenAt = new Date().toISOString();
      for (const item of this.items) {
        if (itemIds.includes(item.id)) item.seenAt = seenAt;
      }
    },
    requestEquipItem(itemId: number) {
      this.pendingEquipItemId = itemId;
    },
    async resolvePendingEquip() {
      if (this.pendingEquipItemId === null) return;
      const itemId = this.pendingEquipItemId;
      this.pendingEquipItemId = null;

      await this.fetchAvatar();
      const item = this.items.find((candidate) => candidate.id === itemId);
      if (!item || !item.owned) return;

      this.openEditor(item.slot);
      await this.equipItem(item);
    },
    openEditor(tab?: AvatarTab) {
      this.isEditorOpen = true;
      if (tab) this.activeTab = tab;
    },
    closeEditor() {
      this.isEditorOpen = false;
    },
    invalidateCache() {
      this.items = [];
      this.equipped = null;
      this.achievements = [];
      this.bloodTypeBadge = null;
      this.showBloodTypeBadge = true;
      this.avatarLoaded = false;
      this.achievementsLoaded = false;
      this.avatarError = "";
      this.achievementsError = "";
      this.saveError = "";
    },
    isEquipped(item: AvatarItem) {
      return this.equipped?.[SLOT_TO_FIELD[item.slot]] === item.id;
    },
    isSlotEmpty(slot: AvatarSlot) {
      return this.equipped?.[SLOT_TO_FIELD[slot]] == null;
    },
  },
  getters: {
    itemsBySlot(state): Record<AvatarSlot, AvatarItem[]> {
      const groups: Record<AvatarSlot, AvatarItem[]> = {
        OLHOS: [],
        CORPO: [],
        PERNAS: [],
        ACESSORIOS: [],
        FUNDO: [],
      };
      for (const item of state.items) groups[item.slot].push(item);
      return groups;
    },
    equippedAssetRef(state) {
      return (slot: AvatarSlot): string | null => {
        const itemId = state.equipped?.[SLOT_TO_FIELD[slot]];
        return state.items.find((i) => i.id === itemId)?.assetRef ?? null;
      };
    },
    unseenItems(state): AvatarItem[] {
      return state.items.filter(
        (item) => item.owned && !item.isDefault && item.seenAt === null,
      );
    },
  },
});
