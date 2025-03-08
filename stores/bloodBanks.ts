export const useBloodBanksStore = defineStore("bloodBanks", {
    state: () => ({
        bloodBanks: [] as any

    }),
    actions: {
        async fetchBloodBanksLocations(token: string) {
            const config = useRuntimeConfig();
            const bloodBanksLocations = await $fetch (`${config.public.hemocioneIdApiUrl}/bloodBanks`)
            this.setBloodBanks(bloodBanksLocations)
        },
        setBloodBanks(bloodBanks: any) {
            this.bloodBanks = bloodBanks;
        }
    },
    getters: {
        bloodBanks(state){
            return state.bloodBanks
        }
    }

})

    