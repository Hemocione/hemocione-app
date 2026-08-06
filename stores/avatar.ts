export type AvatarSlot = "HEAD" | "FACE" | "BODY" | "BACKGROUND";
export type AvatarTab = AvatarSlot | "ACHIEVEMENTS";

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
  headItemId: number | null;
  faceItemId: number | null;
  bodyItemId: number | null;
  backgroundItemId: number | null;
}

export interface AchievementRewardItem {
  id: number;
  key: string;
  name: string;
  slot: AvatarSlot;
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
  HEAD: "headItemId",
  FACE: "faceItemId",
  BODY: "bodyItemId",
  BACKGROUND: "backgroundItemId",
};

export const useAvatarStore = defineStore("avatar", {
  state: () => ({
    items: [] as AvatarItem[],
    equipped: null as AvatarEquipped | null,
    achievements: [] as Achievement[],
    isEditorOpen: false,
    activeTab: "HEAD" as AvatarTab,
  }),
  actions: {
    async fetchAvatar() {
      if (this.items.length > 0) return;

      const config = useRuntimeConfig();
      const userStore = useUserStore();

      const data: { items: AvatarItem[]; equipped: AvatarEquipped } = await $fetch(
        config.public.hemocioneIdApiUrl + "/users/me/avatar",
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      );
      this.items = data.items;
      this.equipped = data.equipped;
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
    isEquipped(item: AvatarItem) {
      return this.equipped?.[SLOT_TO_FIELD[item.slot]] === item.id;
    },
  },
  getters: {
    itemsBySlot(state): Record<AvatarSlot, AvatarItem[]> {
      const groups: Record<AvatarSlot, AvatarItem[]> = { HEAD: [], FACE: [], BODY: [], BACKGROUND: [] };
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
