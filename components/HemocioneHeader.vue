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
  padding: 1em 2em;
  background-color: var(--black-100);
  border-bottom: 1px solid var(--black-40);
  height: 6.25%;
  min-height: fit-content;
  position: sticky;
}
</style>