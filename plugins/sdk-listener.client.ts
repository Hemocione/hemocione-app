import {
  createIframeReceiver,
  type FinishLoadingData,
  type ShareData,
  type ShareInstagramData,
} from "@hemocione/sdk";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:beforeMount", () => {
    const iframeListener = createIframeReceiver();

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
  });
});
