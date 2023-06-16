<template>
  <div class="wrapper">
    <img
      class="user-image"
      src="https://cdn.discordapp.com/attachments/757012940804194367/1113991633063641089/armin.png"
      alt="User Profile Image"
    />
    <div class="user-profile">
      <h3>Doador da Silva</h3>
      <span>26, Masculino</span>
      <div class="status">
        <div class="red-ball" />
        <span>30 dias desde a última doação</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: 0.8em;
}
.red-ball {
  height: 0.8em;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: var(--red-negative-default);
}

.user-image {
  width: 30%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
}

.user-profile {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 1em;
  gap: 0.5em;
  width: 70%;
  font-weight: 400;
  color: var(--black-80);
}

.user-profile h3 {
  font-weight: 600;
  color: var(--black-100);
}
</style>