import CryptoJS from 'crypto-js';
const SECRET_KEY = import.meta.env.REACT_APP_SECRET_KEY;
// Define a function to encrypt a string
export const encryptString = (data, key) => {
  const str = convertToString(data);
  const encrypted = CryptoJS.AES.encrypt(str, key || SECRET_KEY);
  return encrypted.toString();
};

// Define a function to decrypt an encrypted string
export const decryptString = (data, key) => {
  const str = convertToString(data);
  const decrypted = CryptoJS.AES.decrypt(str, key || SECRET_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const convertToString = (param) => {
  if (typeof param === 'object' && param !== null) {
    param = JSON.stringify(param);
  } else if (typeof param !== 'string') {
    throw new Error('Parameter must be an object or a string');
  }
  return param.toString();
};
