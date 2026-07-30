export const DISMISSAL_WINDOW_DAYS = 7;
export const PROFILE_BANNER_DISMISSED_KEY = "profileBannerDismissedAt";

const WINDOW_MS = DISMISSAL_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export const shouldShowBanner = ({
  missingFields,
  dismissedAt,
  now,
}: {
  missingFields: string[];
  dismissedAt: number | null;
  now: number;
}): boolean => {
  if (!missingFields.length) return false;
  if (dismissedAt === null || Number.isNaN(dismissedAt)) return true;

  return now - dismissedAt > WINDOW_MS;
};
