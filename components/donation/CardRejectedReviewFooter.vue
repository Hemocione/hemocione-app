<template>
  <div class="canceled-wrapper">
    <img src="/icons/donation-canceled.active.svg" alt="Doação cancelada" />
    <span>Doação não realizada</span>
  </div>
</template>

<style scoped>
.canceled-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem 1rem;
  background-color: var(--red-very-light);
  color: var(--red-negative-darker);
  border-radius: 0.5rem;
  justify-content: center;
}

.canceled-wrapper img {
  height: 1rem;
  aspect-ratio: 1;
}

.canceled-wrapper span {
  font-size: 0.8rem;
}
</style>
