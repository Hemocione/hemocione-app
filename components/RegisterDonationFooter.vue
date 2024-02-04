<template>
  <CommonCoolFooter>
    <CommonRegisterDonationButton @click="goRegisterDonation" />
  </CommonCoolFooter>
</template>

<script setup lang="ts">
const goRegisterDonation = () => {
  navigateTo("/donations/new");
};
</script>
