<template>
  <header>
    <nav>
      <HeaderTitle />
      <HeaderHamburguerMenu />
    </nav>
  </header>
</template>

<style scoped>
header {
  height: 100%;
  width: 100%;
  background-color: var(--black-100);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: var(--navbar-content-size);
  width: 100%;
  margin: 0;
  padding: 1rem 1.5rem;
}
</style>
