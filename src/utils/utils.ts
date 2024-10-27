export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const uppercaseAll = (text: string): string => {
  return text.toUpperCase();
};

export const formatDateTime = (datetime: string | null | undefined): string | null => {
  console.log(datetime);

  if (!datetime) return null;

  const date = new Date(datetime);
  if (isNaN(date.getTime())) return null; // Invalid date

  const hours = date.getHours().toString().padStart(2, '0'); // Local hours
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Local minutes
  const day = date.getDate().toString().padStart(2, '0'); // Local day
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Local month (0-based)
  const year = date.getFullYear(); // Local year

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
