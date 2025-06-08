import Cookies from 'js-cookie';

export const setPreference = (key: string, value: string) => {
  Cookies.set(`bookburst_${key}`, value, { expires: 365 });
};

export const getPreference = (key: string, defaultValue: string = '') => {
  return Cookies.get(`bookburst_${key}`) || defaultValue;
};

export const removePreference = (key: string) => {
  Cookies.remove(`bookburst_${key}`);
};