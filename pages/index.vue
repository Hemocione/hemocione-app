<template>
  <div class="main">
    <UserDescription />
    <UserDonationSummary />
    <UserLastDonation />
    <section class="cta-wrapper">
      <NuxtLink to="/donations/new" class="cta">
        <CommonRegisterDonationButton style="width: 100%" />
      </NuxtLink>
      <NuxtLink to="/events" class="cta">
        <CommonSecondaryButton>Ver próximos eventos</CommonSecondaryButton>
      </NuxtLink>
    </section>
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

.cta {
  width: 100%;
  height: 3rem;
}

.cta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .cta-wrapper {
    flex-direction: row;
  }
}
</style>
