<template>
  <input
    v-maska:unmaskedValue.unmasked="mask"
    v-model="maskedValue"
    :placeholder="placeholder"
    class="masked-input"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  mask: string;
  placeholder?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const maskedValue = ref(props.modelValue || "");
const unmaskedValue = ref(props.modelValue || "");

watch(unmaskedValue, (value) => {
  emit("update:modelValue", value);
});

defineExpose({ unmaskedValue, maskedValue });
</script>

<style scoped>
.masked-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--el-input-border-color, var(--el-border-color));
  border-radius: 4px;
  font-size: 14px;
  color: var(--el-input-text-color, var(--el-text-color-regular));
  transition: border-color 0.4s ease-in-out;
}

.masked-input:focus {
  border: 1px solid var(--hemo-color-primary);
}
</style>
