<template>
  <div class="blood-type-grid">
    <button
      v-for="bloodType in bloodTypes"
      :key="bloodType"
      type="button"
      :class="[
        'blood-type-button',
        { selected: localModelValue === bloodType },
      ]"
      @click="selectBloodType(bloodType)"
    >
      {{ bloodType }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const { modelValue } = toRefs(props);

watch(modelValue, (newValue) => {
  if (newValue !== localModelValue.value) {
    localModelValue.value = newValue;
  }
});

const emit = defineEmits(["update:modelValue"]);

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const localModelValue = ref(props.modelValue);

const selectBloodType = (bloodType) => {
  localModelValue.value = bloodType;
};

watch(localModelValue, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style scoped>
.blood-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .blood-type-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

.blood-type-button {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: white;
  color: var(--hemo-color-text-secondary-opaque);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.4s ease;
  font-weight: bold;
  border: 2px solid var(--hemo-color-text-secondary-opaque);
}

.blood-type-button.selected {
  background-color: var(--hemo-color-primary);
  color: #fff;
  border: 2px solid var(--hemo-color-primary);
}
</style>
