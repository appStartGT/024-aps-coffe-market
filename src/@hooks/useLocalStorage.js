import { cryptoUtil } from '@utils';

export default function useLocalStorage() {
  const removeItem = (key) => window.localStorage.removeItem(key);

  const setItemWithEncryption = (key, value) => {
    const encryptedValue = cryptoUtil.encryptString(
      value,
      import.meta.env.REACT_APP_SECRET_KEY
    );
    localStorage.setItem(key, encryptedValue);
  };

  const getItemWithDecryption = (key) => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;

    const decryptedValue = cryptoUtil.decryptString(
      encryptedValue,
      import.meta.env.REACT_APP_SECRET_KEY
    );
    return decryptedValue;
  };

  const setItem = (key, value) => {
    localStorage.setItem(key, value);
  };

  const getItem = (key) => {
    const value = localStorage.getItem(key);
    if (!value) return null;

    return value;
  };

  return {
    removeItem,
    getItem,
    setItem,
    setItemWithEncryption,
    getItemWithDecryption,
  };
}
