<template>
  <ElDialog
    v-model="showDialog"
    title=""
    align-center
    width="320px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="review-dialog"
  >
    <div class="review-content">
      <div class="review-header">
        <h3>Você está gostando do App Hemocione?</h3>
        <p>Sua opinião é muito importante para nós!</p>
      </div>
      
      <div class="rating-section">
        <div class="buttons-container">
          <ElButton
            type="primary"
            size="large"
            @click="handleYes"
            :loading="loading"
            class="yes-button"
          >
            Sim
          </ElButton>
          <ElButton
            type="default"
            size="large"
            @click="handleNo"
            :loading="loading"
            class="no-button"
          >
            Não
          </ElButton>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import { AppLauncher } from "@capacitor/app-launcher";

const showDialog = ref(true); // Sempre visível para teste
const loading = ref(false);

const handleYes = async () => {
  loading.value = true;
  
  try {
    console.log('Usuário gostou do app');
    
    // Solicitar review na loja
    await requestStoreReview();
    
    showDialog.value = false;
  } catch (error) {
    console.error('Erro ao processar avaliação positiva:', error);
  } finally {
    loading.value = false;
  }
};

const handleNo = () => {
  console.log('Usuário não gostou do app');
  showDialog.value = false;
};

const requestStoreReview = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Review da loja só funciona em apps nativos');
    return;
  }
  
  try {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'ios') {
      // iOS App Store
      await AppLauncher.openUrl({
        url: 'https://apps.apple.com/app/hemocione/id[SEU_APP_ID]?action=write-review'
      });
    } else if (platform === 'android') {
      // Google Play Store
      await AppLauncher.openUrl({
        url: 'https://play.google.com/store/apps/details?id=br.com.hemocione.app&showAllReviews=true'
      });
    }
  } catch (error) {
    console.error('Erro ao abrir loja:', error);
  }
};
</script>

<style scoped>
/* Modal arredondado */
:deep(.el-dialog) {
  border-radius: 25px !important;
  overflow: hidden;
  border: none !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  --el-dialog-bg-color: #ffffff !important;
  background-color: #ffffff !important;
}

:deep(.el-dialog__header) {
  display: none;
}

:deep(.el-dialog__body) {
  padding: 0;
  border: none !important;
  --el-dialog-bg-color: #ffffff !important;
  background-color: #ffffff !important;
}

:deep(.el-dialog__wrapper) {
  background: rgba(0, 0, 0, 0.5) !important;
}

.review-content {
  text-align: center;
  padding: 0.3rem 0.3rem;
}

.review-header {
  margin-bottom: 1.5rem;
}

.review-header h3 {
  margin: 0 0 0.8rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.review-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.5;
}

.rating-section {
  margin-bottom: 0;
}

.buttons-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.yes-button {
  flex: 1;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px !important;
  background: var(--hemo-color-primary) !important;
  border: none !important;
  transition: all 0.3s ease !important;
}

.yes-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4) !important;
}

.no-button {
  flex: 1;
  height: 50px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px !important;
  background: #f8f9fa !important;
  border: 2px solid #e9ecef !important;
  color: #6c757d !important;
  transition: all 0.3s ease !important;
}

.no-button:hover {
  background: #e9ecef !important;
  border-color: #dee2e6 !important;
  transform: translateY(-1px) !important;
}
</style>
