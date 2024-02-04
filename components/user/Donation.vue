<template>
  <div :class="{ 'donation-card': true, borderBottom, borderTop }">
    <NuxtImg
      :src="logoSrc"
      class="donation-provider-logo"
      width="25"
      height="25"
    />
    <span class="donation-label">{{ props.donation.label }}</span>
    <span class="donation-date">{{ readableSimpleDate }}</span>
  </div>
</template>

<style scoped>
.donation-card {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 1em;
  width: 100%;
  background-color: v-bind("backgroundColor");
}

.donation-date {
  margin-left: auto;
}

.borderTop {
  border-radius: 1.5em 1.5em 0 0;
}

.borderBottom {
  border-radius: 0 0 1.5em 1.5em;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  donation: {
    id: Number;
    label: String;
    donationDate: String;
    donationProvider?: {
      id: Number;
      name: string;
      logo: string;
    } | null;
  };
  backgroundColor: string;
  borderTop: boolean;
  borderBottom: boolean;
}>();

const logoSrc = props.donation.donationProvider?.logo || "/icons/syringe.svg";
const readableSimpleDate = computed(() => {
  const date = new Date(Date.parse(String(props.donation.donationDate)));
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
});
</script>
