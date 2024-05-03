<template>
  <CommonCoolFooter :animation-entrance-delay="500">
    <CommonRegisterDonationButton @click="goRegisterDonation" />
  </CommonCoolFooter>
</template>

<script setup lang="ts">
const goRegisterDonation = () => {
  navigateTo("/donations/new");
};
</script>
