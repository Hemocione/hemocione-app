<template>
  <footer>
    <FooterRegisterDonationButton />
    <FooterAbleToDonateButton />
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid var(--black-40);
  position: fixed;
  padding: 1rem 2rem;
  bottom: 0;
  background-color: white;
  max-height: 18.75%;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  flex-direction: column;
  justify-content: center;
}
</style>