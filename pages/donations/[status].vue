<template>
  <div class="main">
    <CommonBackHeader
      :title="title"
      iconDirection="left"
      :custom-path="'/donations'"
    />
    <div class="content">
      <Transition name="quick-fade" mode="out-in">
        <DonationCardList :donations="donations" v-if="donations.length" />
        <CommonNoDonationsRegistered
          :title="`Não há ${title.toLowerCase()}`"
          hide-message
          v-else
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore, type ReviewStatus, isReviewStatus } from "@/stores/user";
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});

const userStore = useUserStore();
const { pendingDonations, rejectedDonations, confirmedDonations } =
  storeToRefs(userStore);
const route = useRoute();
const status = route.params.status;

if (!isReviewStatus(status)) {
  navigateTo("/donations"); // Redirect to donations page if status is invalid
}

const donations = computed(() => {
  switch (status) {
    case "pending":
      return pendingDonations.value;
    case "rejected":
      return rejectedDonations.value;
    case "confirmed":
      return confirmedDonations.value;
  }
});

const statusToTitle: Record<ReviewStatus, string> = {
  pending: "Confirmações pendentes",
  rejected: "Doações rejeitadas",
  confirmed: "Doações confirmadas",
};

const title = statusToTitle[status];
</script>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
}

.content {
  min-height: 100%;
  width: 100%;
  padding: 1rem;
}
</style>
