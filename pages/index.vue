<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  gap: 2em;
  scroll-behavior: smooth;
  overflow-y: scroll;
}
</style>