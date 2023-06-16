<template>
  <button>
    <img src="/icons/plus.svg" alt="Mais" />
    <span>Registrar nova doação</span>
  </button>
</template>

<style scoped>
button {
  background-color: var(--red-negative-darker);
  border: 1px solid var(--red-negative-darker);
  border-radius: 0.5em;
  padding: 0.5em 1em;
  font-weight: 400;
  cursor: pointer;
  transition: 0.2s;
  color: white;
  align-self: stretch;
  font-size: fill-available;
}

img {
  margin-right: 0.5em;
}
</style>