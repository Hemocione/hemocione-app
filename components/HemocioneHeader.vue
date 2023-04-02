<template>
  <header>
    <HeaderTitle />
    <HeaderHamburguer />
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--black-100);
  border-bottom: 1px solid var(--black-40);
  height: 6.25%;
  min-height: fit-content;
  position: sticky;
}
</style>