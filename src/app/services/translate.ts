import i18next from 'i18next';

export const translate = (key: string): string => {
  return i18next.t(key) ?? '';
};
