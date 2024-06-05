<template>
  <div>
    <img src="/illustrations/bloodDonation.svg" class="missing-img" />
    <h4>Você ainda não tem doações registradas</h4>
    <span
      >Registre sua primeira doação ou confira os próximos eventos para doar
      😊</span
    >
  </div>
</template>

<style scoped>
div {
  text-align: center;
}

.missing-img {
  width: 80%;
  height: auto;
  margin-bottom: 0.5rem;
}

.wrap-missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  max-width: 400px;
  color: var(--black-80);
  gap: 0.5rem;
  text-align: center;
}

.wrap-missing span {
  font-size: 0.9 rem;
}

h4 {
  margin: 0;
}
</style>
