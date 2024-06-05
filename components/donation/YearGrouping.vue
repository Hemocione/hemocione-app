<template>
  <div class="year-wrapper">
    <h4
      :class="{
        year: true,
        'first-year': props.isFirst,
        'middle-year': !props.isFirst && !props.isLast,
      }"
    >
      {{ year }}
    </h4>
    <div class="donations">
      <div class="donation-wrapper" v-for="(donation, index) in donations">
        <DonationCard :donation="donation" />
        <div v-if="!isLastDonation(index)" class="vertical-line" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  year: string;
  donations: Donation[];
  isLast: boolean;
  isFirst: boolean;
}>();

const isLastDonation = (index: number) => {
  return index === props.donations.length - 1;
};
</script>

<style scoped>
.year {
  font-size: 0.85rem;
  font-weight: normal;
  width: calc(100% - (2 * var(--year-margin-base)));
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 2.5rem;
  border-left: var(--history-vertical-line-width) solid
    var(--hemo-color-primary);
  color: var(--black-80);
  margin: 0 var(--year-margin-base);
}

.year-wrapper {
  width: 100%;
}

.vertical-line {
  width: var(--history-vertical-line-width);
  height: 1.5rem;
  margin-left: var(--year-margin-base);
  background-color: var(--hemo-color-primary);
  flex-grow: 1;
}

.first-year {
  border-left: var(--history-vertical-line-width) dotted
    var(--hemo-color-primary);
  justify-content: flex-start;
  height: 1.5rem;
}
</style>
