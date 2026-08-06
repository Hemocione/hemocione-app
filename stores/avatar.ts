export type AvatarSlot = "HEAD" | "FACE" | "BODY" | "BACKGROUND";

export interface AvatarItem {
  id: number;
  key: string;
  name: string;
  slot: AvatarSlot;
  assetRef: string;
  owned: boolean;
}

export interface AvatarEquipped {
  headItemId: number | null;
  faceItemId: number | null;
  bodyItemId: number | null;
  backgroundItemId: number | null;
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
  },
});
