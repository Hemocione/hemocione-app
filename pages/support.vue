<template>
  <div class="support-container">
    <h1 class="page-title">Suporte</h1>

    <div class="info-card">
      <h2 class="card-title">Como podemos ajudar?</h2>
      <p class="card-text">
        Nossa equipe está pronta para ajudar você com qualquer dúvida ou
        problema relacionado ao Hemocione. Entre em contato conosco através do
        WhatsApp e responderemos o mais breve possível.
      </p>
    </div>

    <div class="info-card">
      <h2 class="card-title">Assuntos que podemos ajudar</h2>
      <ul class="support-list">
        <li>Dúvidas sobre o processo de doação</li>
        <li>Problemas técnicos com o aplicativo</li>
        <li>Informações sobre campanhas de doação</li>
        <li>Atualização de dados cadastrais</li>
        <li>Feedback sobre o aplicativo</li>
        <li>Outras questões relacionadas</li>
      </ul>
    </div>

    <div class="button-container">
      <button @click="openWhatsApp" class="whatsapp-button">
        <i class="fab fa-whatsapp"></i>
        <span>Falar com Suporte</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const openWhatsApp = () => {
  const message = encodeURIComponent("Olá, preciso de ajuda com o Hemocione.");
  const whatsappUrl = `https://wa.me/5521970114393?text=${message}`;
  window.open(whatsappUrl, "_blank");
};
</script>

<style scoped>
.support-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  margin-bottom: 1rem;
}

.info-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-text {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.support-list {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.support-list li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.schedule-info {
  line-height: 1.6;
}

.schedule-info p {
  margin-bottom: 0.5rem;
}

.note {
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.whatsapp-button {
  background-color: #25d366;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.whatsapp-button:hover {
  background-color: #128c7e;
}

.whatsapp-button i {
  font-size: 1.25rem;
}

@media (max-width: 640px) {
  .support-container {
    padding: 1rem;
  }
}
</style>
