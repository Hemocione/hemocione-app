import { h, render, onMounted, onUnmounted, nextTick } from "vue";
import CommonIframeWrapper from "~/components/common/IframeWrapper.vue";

const fadeIn = (element: HTMLElement) => {
  element.style.transition = "opacity 0.5s ease";
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.opacity = "1";
  }, 10); // Small delay to ensure the transition is applied
};

// Function to add fade-out transition
const fadeOut = (element: HTMLElement, callback: () => void) => {
  element.style.transition = "opacity 0.5s ease";
  element.style.opacity = "0";
  setTimeout(() => {
    callback();
  }, 500); // Wait for the transition to complete before executing the callback
};

export function usePersistentIframe(
  iframeId: string,
  src: string,
  includeToken = false
) {
  const route = useRoute();

  onMounted(async () => {
    const iframeWrapper = document.getElementById("iframe-page-wrapper");
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement;

    if (!iframeWrapper) {
      return;
    }

    if (iframe) {
      iframe.style.display = "block";
      fadeIn(iframe); // Apply fade-in transition
    }

    if (!iframe) {
      const component = h(CommonIframeWrapper, {
        src,
        includeToken,
        route,
      });

      const div = document.createElement("div");
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.display = "block";
      div.id = iframeId;
      iframeWrapper.appendChild(div);

      render(component, div);

      // Wait for the next tick to ensure the iframe is rendered
      nextTick(() => {
        const newIframe = document.getElementById(
          iframeId
        ) as HTMLIFrameElement;
        if (newIframe) {
          fadeIn(newIframe); // Apply fade-in transition to the new iframe
        }
      });
    }

    iframeWrapper.style.display = "block";
  });

  onBeforeUnmount(() => {
    const iframeWrapper = document.getElementById("iframe-page-wrapper");

    if (iframeWrapper) {
      iframeWrapper.style.display = "none";
    }

    const iframe = document.getElementById(iframeId);
    if (iframe) {
      // Apply fade-out transition before hiding the iframe
      fadeOut(iframe, () => {
        iframe.style.display = "none";
      });
    }
  });
}
