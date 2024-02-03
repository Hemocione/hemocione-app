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

const GENDER_CONFIG = {
  M: {
    limitDaysInterval: 60,
    limitPerYear: 4,
  },
  F: {
    limitDaysInterval: 90,
    limitPerYear: 3,
  },
  O: {
    limitDaysInterval: 90,
    limitPerYear: 3,
  },
} as const;

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

    userDonations(state) {
      if (!state.user?.donations.length) return [];

      const donations = state.user.donations;
      const orderedDonationsByDateDesc = donations.sort((a, b) => {
        const dateA = new Date(Date.parse(String(a.donationDate)));
        const dateB = new Date(Date.parse(String(b.donationDate)));

        return dateB.getTime() - dateA.getTime();
      });

      return orderedDonationsByDateDesc;
    },

    userDonationStatus(state) {
      if (!state.user?.donations.length)
        return {
          status: "never-donated",
          label: "Nunca doou sangue - doe pela primeira vez! :)",
        };

      const donations = state.user.donations;
      const orderedDonationsByDateDesc = donations.sort((a, b) => {
        const dateA = new Date(Date.parse(String(a.donationDate)));
        const dateB = new Date(Date.parse(String(b.donationDate)));

        return dateB.getTime() - dateA.getTime();
      });
      const newestDonation = orderedDonationsByDateDesc[0];
      const donationDate = new Date(
        Date.parse(String(newestDonation?.donationDate))
      );
      const now = new Date();
      const daysSinceLastDonation = Math.floor(
        (now.getTime() - donationDate.getTime()) / (1000 * 3600 * 24)
      );

      const genderConfig = GENDER_CONFIG[state.user.gender];
      const surpassedLimitDaysInterval =
        daysSinceLastDonation > genderConfig.limitDaysInterval;

      const donationOnYearLimit =
        orderedDonationsByDateDesc[genderConfig.limitPerYear - 1] || null;
      const alreadyDonatedMaxTimesOnCurrentYear =
        donationOnYearLimit &&
        (now.getTime() -
          new Date(
            Date.parse(String(donationOnYearLimit.donationDate))
          ).getTime()) /
          (1000 * 3600 * 24 * 365) <
          1;
      if (surpassedLimitDaysInterval && !alreadyDonatedMaxTimesOnCurrentYear) {
        return {
          status: "able-to-donate",
          label: `Última doação há ${daysSinceLastDonation} dias - você já pode doar novamente!`,
        };
      }

      let unableLabel = alreadyDonatedMaxTimesOnCurrentYear
        ? `Você já doou ${genderConfig.limitPerYear} vezes no período de 1 ano - você ainda não pode doar novamente.`
        : `Última doação há ${daysSinceLastDonation} dias - você ainda não pode doar novamente`;
      return {
        status: "unable-to-donate",
        label: unableLabel,
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
