const reviewStatuses = ["confirmed", "pending", "rejected"] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];

export const isReviewStatus = (value: any): value is ReviewStatus => {
  return reviewStatuses.includes(value);
};

const getUserDonationsByStatus = (
  userDonations: Donation[] | undefined,
  status: ReviewStatus
) => {
  if (!userDonations?.length) return [];

  const donations = userDonations.filter(
    (donation) => donation.reviewStatus === status
  );
  const orderedDonationsByDateDesc = donations.sort((a, b) => {
    const dateA = new Date(Date.parse(String(a.donationDate)));
    const dateB = new Date(Date.parse(String(b.donationDate)));

    return dateB.getTime() - dateA.getTime();
  });

  return orderedDonationsByDateDesc;
};

export interface Donation {
  id: number;
  label: string;
  donationDate: string;
  donationProvider?: {
    id: number;
    name: string;
    logo: string;
  } | null;
  reviewStatus: ReviewStatus;
  bloodBanksLocationId: string | null;
  reviewedAt: Date | null;
  metadata: Record<string, unknown> | null;
}

interface UserWithMetrics extends User {
  donations: Donation[];
  name: string;
  totalDonations: number;
  livesSaved: number;
}
export interface Address {
  id: number;
  userId: string;
  postalCode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  createdAt: string;
  updatedAt: string;
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
  id: string;
  givenName: string;
  surName: string;
  email: string;
  gender: Gender;
  document: string;
  birthDate: string;
  bloodType: string;
  phone: string;
  donations: Donation[];
  addresses: Address[];
  firstAppAccessAt: string | null;
}

export type UserUpdate = Omit<User, "donations" | "addresses"> & {
  addresses?: Partial<Address>[];
};

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import OneSignal from "onesignal-cordova-plugin";

// TODO: add composable to handle token usage in the API calls

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    token: "" as string,
    loggedIn: false as Boolean,
  }),
  actions: {
    async reviewDonation(donation: Donation, status: ReviewStatus) {
      const config = useRuntimeConfig();

      // update donation status on the server
      await $fetch(
        config.public.hemocioneIdApiUrl + `/donations/${donation.id}/review`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      // update donation status on the store after successfully updating it on the server
      const userMatchingDonation = this.user?.donations.find(
        (userDonation) => userDonation.id === donation.id
      );
      console.log("userMatchingDonation", userMatchingDonation);
      if (userMatchingDonation) {
        userMatchingDonation.reviewStatus = status; // update user donation status on the store
        userMatchingDonation.reviewedAt = new Date(); // update user donation reviewedAt on the store
      }
    },
    setFirstAppAccessAt() {
      const config = useRuntimeConfig();

      $fetch(config.public.hemocioneIdApiUrl + "/users/set-first-app-access", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }).then((_data) => {
        if (!this.user) {
          return;
        }

        this.user.firstAppAccessAt = new Date().toISOString();
      });
    },
    async fetchMe() {
      const config = useRuntimeConfig();

      const data: User = await $fetch(
        config.public.hemocioneIdApiUrl + "/users/me",
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (!this.user?.firstAppAccessAt) {
        this.setFirstAppAccessAt();
      }

      this.setUser(data);
    },
    async setToken(token: string) {
      try {
        this.token = token;
        await this.fetchMe();
        this.loggedIn = true;
        // OneSignal initialization for push notifications
        if (this.user && Capacitor.isNativePlatform()) {
          OneSignal.login(this.user.id.toString());
          await OneSignal.Notifications.requestPermission();
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        await this.logout();
      }
    },
    setUser(user: any) {
      this.user = user;
    },
    async createUserDonation(donationData: {
      label: string;
      bloodBanksLocationId?: string;
      donationDate: string;
    }) {
      const config = useRuntimeConfig();
      const data: { message: string; donation: Donation } = await $fetch(
        config.public.hemocioneIdApiUrl + "/donations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(donationData),
        }
      );
      this.user?.donations.push(data.donation);
    },
    async updateUser(user: UserUpdate) {
      const config = useRuntimeConfig();
      await $fetch(config.public.hemocioneIdApiUrl + `/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(user),
      });
      this.setUser({
        ...this.user, // keep the rest of the user data (derived from /me, for example donations)
        ...user,
      });
    },
    async logout() {
      const config = useRuntimeConfig();

      // TODO: do this in a better way. This is a workaround to force reload the page
      window.location.href = "/?noAuto=true";
      this.$reset();
      await Preferences.remove({ key: config.public.authLocalKey });
      const cookie = useCookie(config.public.authLocalKey, {
        domain: config.public.cookieDomain,
      });
      cookie.value = undefined;
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
      return getUserDonationsByStatus(state.user?.donations, "confirmed") || [];
    },

    rejectedDonations(state) {
      return getUserDonationsByStatus(state.user?.donations, "rejected") || [];
    },

    pendingDonations(state) {
      return getUserDonationsByStatus(state.user?.donations, "pending") || [];
    },

    confirmedDonations(state) {
      return getUserDonationsByStatus(state.user?.donations, "confirmed") || [];
    },

    userDonationStatus(state) {
      if (!this.confirmedDonations.length) {
        return {
          status: "never-donated",
          label:
            "Nunca doou sangue - doe pela primeira vez e salve 4 vidas! 😊",
        };
      }

      const donations = this.confirmedDonations;
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
      const daysSinceLastDonation = Math.ceil(
        (now.getTime() - donationDate.getTime()) / (1000 * 3600 * 24)
      );

      const genderConfig = GENDER_CONFIG[state?.user?.gender || "O"];
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
          label: `Última doação há ${daysSinceLastDonation} ${
            daysSinceLastDonation === 1 ? "dia" : "dias"
          } - você já pode doar novamente!`,
        };
      }

      let unableLabel = alreadyDonatedMaxTimesOnCurrentYear
        ? `Você já doou ${genderConfig.limitPerYear} vezes no período de 1 ano - você ainda não pode doar novamente.`
        : `Última doação há ${daysSinceLastDonation} ${
            daysSinceLastDonation === 1 ? "dia" : "dias"
          } - você ainda não pode doar novamente`;
      return {
        status: "unable-to-donate",
        label: unableLabel,
      };
    },

    userWithMetrics(state): UserWithMetrics | null {
      if (!state.user) return null;

      return {
        ...state.user,
        donations: this.confirmedDonations,
        name: state.user.givenName,
        totalDonations: this.confirmedDonations.length,
        livesSaved: 4 * this.confirmedDonations.length,
      };
    },
    lastDonation(state) {
      if (!state.user?.donations.length) return null;

      const donations = this.pendingDonations.length
        ? this.pendingDonations
        : this.confirmedDonations; // If there are pending donations, show the last pending donation
      const orderedDonationsByDateDesc = donations.sort((a, b) => {
        const dateA = new Date(Date.parse(String(a.donationDate)));
        const dateB = new Date(Date.parse(String(b.donationDate)));

        return dateB.getTime() - dateA.getTime();
      });

      return orderedDonationsByDateDesc[0];
    },
    lastDonationBloodBankLocationId(state) {
      const donationsWithBloodBank = state.user?.donations.filter(
        (donation) => donation.bloodBanksLocationId
      );
      const orderedDonationsByDateDesc = donationsWithBloodBank?.sort(
        (a, b) => {
          const dateA = new Date(Date.parse(String(a.donationDate)));
          const dateB = new Date(Date.parse(String(b.donationDate)));

          return dateB.getTime() - dateA.getTime();
        }
      );

      return orderedDonationsByDateDesc?.[0]?.bloodBanksLocationId;
    },
  },
});
