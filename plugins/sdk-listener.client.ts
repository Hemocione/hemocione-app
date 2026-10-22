import {
  createIframeReceiver,
  isHemocioneOrigin,
  type FinishLoadingData,
  type ShareData,
  type ShareInstagramData,
  type VirtualDonationData,
} from "@hemocione/sdk";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:beforeMount", () => {
    // Only Hemocione origins may talk to the app (all embeds are
    // *.hemocione.com.br); required since SDK 0.2.0 warns on an open receiver.
    const iframeListener = createIframeReceiver(isHemocioneOrigin);

    iframeListener.on(
      "hemocione:finish-loading",
      async (data: FinishLoadingData) => {
        console.log("SDK finished loading:", data);
      }
    );

    iframeListener.on("hemocione:share", async (data: ShareData) => {
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }
    });

    iframeListener.on(
      "hemocione:share-instagram",
      async (data: ShareInstagramData) => {
        console.log("Share Instagram:", data);
        console.log("not implemented");
      }
    );

    iframeListener.on(
      "hemocione:register-virtual-donation",
      async (data: VirtualDonationData) => {
        const store = useUserStore();
        store.addVirtualDonation(data);
      }
    );

    registerHemarcioHandlers(iframeListener, (path) => navigateTo(path));
  });
});
