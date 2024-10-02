import { cryptoUtil } from '@utils';

export const getItemWithDecryption = (key) => {
  const encryptedValue = sessionStorage.getItem(key);
  if (!encryptedValue) return null;

  const decryptedValue = cryptoUtil.decryptString(
    encryptedValue,
    import.meta.env.REACT_APP_SECRET_KEY
  );
  return JSON.parse(decryptedValue);
};
