<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
    <UserLastDonations />
    <!-- <ProfileFooter /> TODO: uncomment when interaction is created -->
  </div>
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
