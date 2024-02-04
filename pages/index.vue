<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
    <UserLastDonations />
    <ProfileFooter />
  </div>
</template>

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
