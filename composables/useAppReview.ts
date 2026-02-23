import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const REVIEW_PREFERENCE_KEY = "lastAppReviewPromptTs";
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

/**
 * Composable to request an in-app review from the user.
 * The prompt is shown at most once every 6 months per device.
 * Only triggers on native platforms (iOS / Android).
 *
 * Usage: call `requestReview()` after a meaningful user action
 * (e.g. successfully registering a donation).
 */
export function useAppReview() {
  const requestReview = async () => {
    // Only available on native platforms
    if (!Capacitor.isNativePlatform()) return;

    try {
      const { value } = await Preferences.get({ key: REVIEW_PREFERENCE_KEY });

      if (value) {
        const lastPromptTs = parseInt(value, 10);
        const sixMonthsAgo = Date.now() - SIX_MONTHS_MS;

        // Don't show if prompted within the last 6 months
        if (lastPromptTs > sixMonthsAgo) return;
      }

      // Lazy-load the plugin to avoid import errors on web
      const { InAppReview } = await import("@capacitor-community/in-app-review");
      await InAppReview.requestReview();

      // Persist the timestamp so we don't prompt again too soon
      await Preferences.set({
        key: REVIEW_PREFERENCE_KEY,
        value: Date.now().toString(),
      });
    } catch (error) {
      // Review prompts are best-effort — never block the user flow
      console.warn("[useAppReview] Failed to request review:", error);
    }
  };

  return { requestReview };
}
