export interface Donation {
  id: Number;
  label: String;
  donationDate: String;
  donationProvider?: {
    id: Number;
    name: string;
    logo: string;
  } | null;
}

const genderToReadable = {
  M: "Masculino",
  F: "Feminino",
  O: "",
} as const;

const MALE_LIMIT_DAYS = 60;
const FEMALE_LIMIT_DAYS = 90;

const genders = ["M", "F", "O"] as const;
type Gender = (typeof genders)[number];

interface User {
  id: Number;
  givenName: String;
  surName: String;
  email: String;
  gender: Gender;
  birthDate: String;
  bloodType: String;
  telephone: String;
  donations: Donation[];
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  actions: {
    async fetchMe() {
      const config = useRuntimeConfig();

      const { data }: { data: Ref<User> } = await useFetch(
        config.public.hemocioneIdApiUrl + "/users/me",
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      this.setUser(data.value);
    },
    async setToken(token: string) {
      this.token = token;
      await this.fetchMe();
    },
    setUser(user: any) {
      this.user = user;
    },
  },
  getters: {
    userAge(state) {
      if (!state.user) return null;

      const birthDate = new Date(Date.parse(String(state.user.birthDate)));
      const birthYear = birthDate.getFullYear();
      const now = new Date();

      const currentYear = now.getFullYear();
      let age = currentYear - birthYear;

      // Check if the birthday has already occurred this year
      if (
        now.getMonth() < birthDate.getMonth() ||
        (now.getMonth() === birthDate.getMonth() &&
          now.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },

    userReadableGender(state) {
      return genderToReadable[state.user?.gender || "O"];
    },

    userDonationStatus(state) {
      if (!state.user?.donations.length)
        return {
          status: "never-donated",
          label: "Nunca doou sangue - doe pela primeira vez! :)",
        };

      const donations = state.user.donations;
      let newestDonation: Donation | null = null;
      for (const donation of donations) {
        if (!newestDonation) {
          newestDonation = donation;
          continue;
        }

        const donationDate = new Date(
          Date.parse(String(donation.donationDate))
        );
        const newestDonationDate = new Date(
          Date.parse(String(newestDonation.donationDate))
        );

        if (donationDate > newestDonationDate) newestDonation = donation;
      }

      const donationDate = new Date(
        Date.parse(String(newestDonation?.donationDate))
      );
      const now = new Date();
      const daysSinceLastDonation = Math.floor(
        (now.getTime() - donationDate.getTime()) / (1000 * 3600 * 24)
      );

      const manAbleToDonateAgain =
        state.user.gender === "M" && daysSinceLastDonation >= MALE_LIMIT_DAYS;

      if (manAbleToDonateAgain || daysSinceLastDonation >= FEMALE_LIMIT_DAYS)
        return {
          status: "able-to-donate",
          label: `Última doação há ${daysSinceLastDonation} dias - você já pode doar novamente!`,
        };

      return {
        status: "unable-to-donate",
        label: `Última doação há ${daysSinceLastDonation} dias - você ainda não pode doar novamente`,
      };
    },
    userWithMetrics(state) {
      if (!state.user) return null;

      return {
        ...state.user,
        name: `${state.user.givenName} ${state.user.surName}`,
        totalDonations: state.user.donations.length,
        livesSaved: 4 * state.user.donations.length,
      };
    },
  },
});
