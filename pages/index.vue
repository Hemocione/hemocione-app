<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
    <UserLastDonations />
  </div>
  <ProfileFooter />
</template>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  gap: 2em;
  scroll-behavior: smooth;
  overflow-y: scroll;
  width: 100%;
  min-height: 100%;
}
</style>
