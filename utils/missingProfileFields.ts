export type MissingProfileField = "document" | "gender" | "address";

interface ProfileShape {
  document?: string | null;
  gender?: string | null;
  addresses?: unknown[] | null;
}

/**
 * Fields a donor still has to fill in. Google signups only collect blood type,
 * phone and birth date, so these arrive empty and are completed here in the app.
 * Applies to any incomplete account, including older email/password signups.
 */
export const getMissingProfileFields = (
  user: ProfileShape | null | undefined
): MissingProfileField[] => {
  if (!user) return [];

  const missing: MissingProfileField[] = [];
  if (!user.document) missing.push("document");
  if (!user.gender) missing.push("gender");
  if (!user.addresses?.length) missing.push("address");

  return missing;
};
