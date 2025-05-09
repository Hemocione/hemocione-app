export const usePosthog = () => {
  const posthog = useNuxtApp().$posthog();
  return posthog;
};
