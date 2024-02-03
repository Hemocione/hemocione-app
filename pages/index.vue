<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
    <UserLastDonations />
  </div>
  <!-- <ProfileFooter /> TODO: uncomment when the footer actually does anything -->
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
</script>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  gap: 2em;
  width: 100%;
  min-height: 100%;
}
</style>
