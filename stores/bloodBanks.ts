interface BloodBankLocation {
  id: string;
  name: string;
}

export const useBloodBanksStore = defineStore("bloodBanks", {
  state: () => ({
    bloodBanks: [] as BloodBankLocation[],
  }),
  actions: {
    setBloodBanks(bloodBanks: any) {
      this.bloodBanks = bloodBanks;
    },
    async fetchBloodBanksLocations(token: string) {
      const config = useRuntimeConfig();
      const bloodBanksLocations = await $fetch(
        `${config.public.hemocioneIdApiUrl}/bloodBanks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this.setBloodBanks(bloodBanksLocations);
    },
    async getBloodBanks(token: string) {
      try {
        if (!this.bloodBanks.length) {
          // fetch bloodBanks if not loaded yet
          await this.fetchBloodBanksLocations(token);
        }

        return this.bloodBanks;
      } catch (e) {
        return [];
      }
    },
  },
});
