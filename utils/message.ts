const defaultOffset = 16;
import { ElMessage, ElNotification } from "element-plus";
import type { VNode } from "vue";

interface Options {
  message: string;
  type: "success" | "error" | "info" | "warning";
  offset?: number;
  duration?: number;
  anchor?: VNode;
  grouping?: boolean;
  showClose?: boolean;
}

export const HemoMessage = async (options: Options) => {
  const topSafeAreaInset = await useTopSafeAreaInset();
  return ElMessage({
    offset: defaultOffset + topSafeAreaInset.value,
    ...options,
  });
};

export const HemoNotification = async (options: Options) => {
  const topSafeAreaInset = await useTopSafeAreaInset();
  return ElNotification({
    offset: defaultOffset + topSafeAreaInset.value,
    ...options,
  });
};
