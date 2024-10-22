export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const uppercaseAll = (text: string): string => {
  return text.toUpperCase();
};

export const formatDateTime = (datetime: string | null | undefined): string | null => {
  if (!datetime) return null;

  const date = new Date(datetime);
  if (isNaN(date.getTime())) return null; // Invalid date

  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
