<template>
  <div class="donation-card">
    <div class="donation-provider-logo">
      <img :src="logoSrc" />
    </div>
    <div class="donation-info">
      <span class="donation-date">{{ readableSimpleDate }}</span>
      <span class="donation-label">
        {{ props.donation.label }}
      </span>
    </div>
    <ElIcon :size="20">
      <ElIconArrowRightBold />
    </ElIcon>
  </div>
</template>

<style scoped>
.donation-card {
  display: flex;
  align-items: center;
  border: 1px solid var(--black-20);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
  gap: 1rem;
}

.hide {
  opacity: 0;
}

.donation-date {
  font-size: 0.7rem;
  color: var(--black-80);
}

.donation-info {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  height: 100%;
  gap: 0.5rem;
}

.donation-label {
  font-size: 0.9rem;
  overflow: hidden;
  max-lines: 2;
  text-overflow: ellipsis;
  max-width: 100%;
  color: var(--black-100);
}

.donation-provider-logo {
  padding: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  aspect-ratio: 1;
  background-color: var(--black-5);
}

.donation-provider-logo img {
  aspect-ratio: 1;
  width: 100%;
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
</style>

<script setup lang="ts">
const props = defineProps<{
  donation: Donation;
}>();

const logoSrc =
  props.donation.donationProvider?.logo || "/icons/syringe-provider.svg";
const readableSimpleDate = computed(() => {
  const date = new Date(Date.parse(String(props.donation.donationDate)));
  return getMinorDate(date);
});
</script>
