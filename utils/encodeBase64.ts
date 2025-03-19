export const encodeBase64 = (obj: Record<string, unknown>) => {
  return btoa(encodeURIComponent(JSON.stringify(obj)));
};
