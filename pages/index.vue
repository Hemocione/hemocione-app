<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
    <UserLastDonation />
    <CommonDonationCTAs />
  </div>
</template>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1.5rem;
  width: 100%;
  min-height: 100%;
}
</style>
