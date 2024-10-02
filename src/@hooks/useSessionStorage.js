import { cryptoUtil } from '@utils';

export default function useSessionStorage() {
  const removeItem = (key) => window.sessionStorage.removeItem(key);

  // Define a function to set a key-value pair in local storage with encryption
  const setItemWithEncryption = (key, value) => {
    const encryptedValue = cryptoUtil.encryptString(
      value,
      import.meta.env.REACT_APP_SECRET_KEY
    );
    sessionStorage.setItem(key, encryptedValue);
  };

  // Define a function to get a value from local storage with decryption
  const getItemWithDecryption = (key) => {
    const encryptedValue = sessionStorage.getItem(key);
    if (!encryptedValue) return null;

    const decryptedValue = cryptoUtil.decryptString(
      encryptedValue,
      import.meta.env.REACT_APP_SECRET_KEY
    );
    return decryptedValue;
  };

  return {
    removeItem,
    setItemWithEncryption,
    getItemWithDecryption,
  };
}
