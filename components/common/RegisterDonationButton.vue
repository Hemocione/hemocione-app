<template>
  <button>
    <el-icon size="15">
      <ElIconPlus />
    </el-icon>
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
  color: white;
  font-size: fill-available;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}
</style>
