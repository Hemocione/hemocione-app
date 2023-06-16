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
  padding: 1em 2em;
  bottom: 0;
  background-color: white;
  height: 18.75%;
  display: grid;
  gap: 1em;
  width: 100%;
  flex-direction: column;
  justify-items: stretch;
}
</style>