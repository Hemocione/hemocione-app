export const avatarAssetUrl = (assetRef: string): string => {
  if (assetRef.startsWith("http://") || assetRef.startsWith("https://")) return assetRef;
  return `/illustrations/avatarItems/${assetRef}`;
};
