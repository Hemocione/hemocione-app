import { h, render, onMounted, onUnmounted, nextTick } from "vue";
import CommonIframeWrapper from "~/components/common/IframeWrapper.vue";

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
      iframe.style.display = "none";
    }
  });
}
