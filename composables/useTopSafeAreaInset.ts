import { SafeArea } from "capacitor-plugin-safe-area";

let topSafeAreaInset = ref(0);
let inited = false;

export const useTopSafeAreaInset = async () => {
  if (inited) {
    return topSafeAreaInset;
  }

  const { insets } = await SafeArea.getSafeAreaInsets();
  topSafeAreaInset.value = insets.top;
  SafeArea.addListener("safeAreaChanged", ({ insets }) => {
    topSafeAreaInset.value = insets.top;
  });

  inited = true;
  return topSafeAreaInset;
};
