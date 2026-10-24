export const DISMISSAL_WINDOW_DAYS = 7;

const WINDOW_MS = DISMISSAL_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const KEY_PREFIX = "profileBannerDismissedAt";

/**
 * Preferences key for the dismissal, scoped to the donor. Devices are shared —
 * a family, or a tablet at a collection drive — so a single key would let one
 * donor's dismissal hide another donor's pending fields.
 */
export const getDismissalKey = (userId?: string | null): string =>
  userId ? `${KEY_PREFIX}:${userId}` : KEY_PREFIX;

// A persisted value can be absent, corrupted (Number("") is 0, Number("x") is
// NaN, Number("Infinity") is Infinity) or ahead of the clock after a timezone
// or device-time change. None of those should hide the banner: a negative or
// infinite age would keep it hidden forever.
const isUsableDismissal = (dismissedAt: number | null, now: number): boolean =>
  dismissedAt !== null &&
  Number.isFinite(dismissedAt) &&
  dismissedAt <= now;

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
  if (!isUsableDismissal(dismissedAt, now)) return true;

  return now - (dismissedAt as number) > WINDOW_MS;
};

/**
 * Milliseconds until an active dismissal expires, or null when there is nothing
 * to wait for. The banner is driven by a computed value, and `Date.now()` is not
 * reactive — an app left open (or suspended, on mobile) past the window would
 * never bring it back without this.
 */
export const nextDismissalExpiry = ({
  dismissedAt,
  now,
}: {
  dismissedAt: number | null;
  now: number;
}): number | null => {
  if (!isUsableDismissal(dismissedAt, now)) return null;

  const remaining = (dismissedAt as number) + WINDOW_MS - now;

  return remaining > 0 ? remaining : null;
};
