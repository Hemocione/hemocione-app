export type AvatarSlot = "OLHOS" | "CORPO" | "PERNAS" | "ACESSORIOS" | "FUNDO";
export type AvatarTab = AvatarSlot | "ACHIEVEMENTS" | "SELO";

export interface AvatarItem {
  id: number;
  key: string;
  name: string;
  slot: AvatarSlot;
  assetRef: string;
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
  }),
  actions: {
    async fetchAvatar() {
      if (this.items.length > 0) return;

      const config = useRuntimeConfig();
      const userStore = useUserStore();

      const data: {
        items: AvatarItem[];
        equipped: AvatarEquipped;
        bloodTypeBadge: BloodTypeBadge | null;
      } = await $fetch(config.public.hemocioneIdApiUrl + "/users/me/avatar", {
        headers: { Authorization: `Bearer ${userStore.token}` },
      });
      this.items = data.items;
      this.equipped = data.equipped;
      this.bloodTypeBadge = data.bloodTypeBadge;
      this.showBloodTypeBadge = data.bloodTypeBadge !== null;
    },
    async fetchAchievements() {
      if (this.achievements.length > 0) return;

      const config = useRuntimeConfig();
      const userStore = useUserStore();

      const data: Achievement[] = await $fetch(
        config.public.hemocioneIdApiUrl + "/users/me/achievements",
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      );
      this.achievements = data;
    },
    async equipItem(item: AvatarItem) {
      if (!item.owned || !this.equipped) return;

      const config = useRuntimeConfig();
      const userStore = useUserStore();
      const updatedEquipped = { ...this.equipped, [SLOT_TO_FIELD[item.slot]]: item.id };

      const data: AvatarEquipped = await $fetch(
        config.public.hemocioneIdApiUrl + "/users/me/avatar",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${userStore.token}` },
          body: JSON.stringify(updatedEquipped),
        }
      );
      this.equipped = data;
    },
    async unequipItem(slot: AvatarSlot) {
      if (!this.equipped) return;

      const config = useRuntimeConfig();
      const userStore = useUserStore();
      const updatedEquipped = { ...this.equipped, [SLOT_TO_FIELD[slot]]: null };

      const data: AvatarEquipped = await $fetch(
        config.public.hemocioneIdApiUrl + "/users/me/avatar",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${userStore.token}` },
          body: JSON.stringify(updatedEquipped),
        }
      );
      this.equipped = data;
    },
    async toggleBloodTypeBadge() {
      const config = useRuntimeConfig();
      const userStore = useUserStore();
      this.showBloodTypeBadge = !this.showBloodTypeBadge;

      await $fetch(
        config.public.hemocioneIdApiUrl + "/users/me/avatar",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${userStore.token}` },
          body: JSON.stringify({ showBloodTypeBadge: this.showBloodTypeBadge }),
        }
      );
    },
    async markItemsSeen() {
      const itemIds = this.unseenItems.map((item) => item.id);
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
        }
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

      void this.markItemsSeen().catch((error) => {
        console.error("Error marking avatar items as seen", error);
      });
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
    },
    isEquipped(item: AvatarItem) {
      return this.equipped?.[SLOT_TO_FIELD[item.slot]] === item.id;
    },
  },
  getters: {
    itemsBySlot(state): Record<AvatarSlot, AvatarItem[]> {
      const groups: Record<AvatarSlot, AvatarItem[]> = { OLHOS: [], CORPO: [], PERNAS: [], ACESSORIOS: [], FUNDO: [] };
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
      return state.items.filter((item) => item.owned && item.seenAt === null);
    },
  },
});
