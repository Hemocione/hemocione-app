<template>
  <div
    :class="{
      'donation-card': true,
    }"
  >
    <div class="timeline-wrapper">
      <div :class="{ 'vertical-line': true, hide: !shouldShowTopLine }"></div>
      <div class="donation-provider-logo">
        <img :src="logoSrc" />
      </div>
      <div
        :class="{ 'vertical-line': true, hide: !shouldShowBottomLine }"
      ></div>
    </div>
    <span class="donation-date">{{ readableSimpleDate }}</span>
    <span class="donation-label">{{ props.donation.label }}</span>
  </div>
</template>

<style scoped>
.donation-card {
  display: flex;
  align-items: center;
  padding: 0 0;
  width: 100%;
}

.hide {
  opacity: 0;
}

.donation-date {
  font-size: 0.5rem;
  color: var(--hemo-color-primary);
  font-weight: bold;
  align-self: flex-start;
}

.donation-label {
  padding-left: 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.donation-provider-logo {
  border: var(--hemo-color-primary) solid 2px;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
}

.timeline-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vertical-line {
  width: 2px;
  height: 0.5rem;
  background-color: var(--hemo-color-primary);
  flex-grow: 1;
}

.donation-prodvider-logo img {
  aspect-ratio: 1;
  width: 50%;
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
  first: boolean;
  last: boolean;
}>();

const middleDonation = computed(() => !props.first && !props.last);

const shouldShowTopLine = computed(
  () => (props.first || middleDonation) && !props.last
);

const shouldShowBottomLine = computed(
  () => (props.last || middleDonation) && !props.first
);

const logoSrc = props.donation.donationProvider?.logo || "/icons/syringe.svg";
const readableSimpleDate = computed(() => {
  const date = new Date(Date.parse(String(props.donation.donationDate)));
  return `${date.getDate()}/${date.getMonth() + 1}/${date
    .getFullYear()
    .toString()
    .slice(2)}`;
});
</script>
