<template>
  <div class="delete-account-container">
    <h1 class="page-title">Excluir Conta</h1>

    <div class="info-card">
      <h2 class="card-title">Como Solicitar a Exclusão da Conta</h2>
      <ol class="steps-list">
        <li>Entre em contato com nossa equipe através do WhatsApp</li>
        <li>Informe que deseja excluir sua conta</li>
        <li>Forneça seu e-mail cadastrado para identificação</li>
        <li>
          Responda algumas perguntas de segurança para confirmar sua identidade
          (como data de nascimento e última doação)
        </li>
        <li>Aguarde a confirmação da exclusão</li>
      </ol>
    </div>

    <div class="info-card">
      <h2 class="card-title">Dados e Armazenamento</h2>
      <div class="data-section">
        <div class="data-block">
          <h3 class="data-title">Dados que serão excluídos:</h3>
          <ul class="data-list">
            <li>Informações pessoais</li>
            <li>Histórico de doações</li>
            <li>Preferências e configurações</li>
            <li>Dados de localização</li>
          </ul>
        </div>
        <div class="data-block">
          <h3 class="data-title">Dados que podem ser mantidos:</h3>
          <ul class="data-list">
            <li>Registros de doações realizadas (por questões legais)</li>
            <li>Dados anonimizados para fins estatísticos</li>
          </ul>
        </div>
        <p class="data-note">
          Após a exclusão, seus dados pessoais serão removidos em até 30 dias,
          conforme exigido pela LGPD.
        </p>
      </div>
    </div>

    <div class="button-container">
      <button @click="openWhatsApp" class="whatsapp-button">
        <i class="fab fa-whatsapp"></i>
        <span>Contatar via WhatsApp</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const openWhatsApp = () => {
  const message = encodeURIComponent(
    "Olá, gostaria de solicitar a exclusão da minha conta no Hemocione."
  );
  const whatsappUrl = `https://wa.me/5521970114393?text=${message}`;
  window.open(whatsappUrl, "_blank");
};
</script>

<style scoped>
.delete-account-container {
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

.steps-list {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.steps-list li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.data-block {
  margin-bottom: 1rem;
}

.data-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.data-list {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.data-list li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.data-note {
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
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
  .delete-account-container {
    padding: 1rem;
  }
}
</style>
