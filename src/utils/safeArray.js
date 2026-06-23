export const safeArray = (data) => {
  return Array.isArray(data) ? data : [];
};