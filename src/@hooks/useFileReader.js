import { useState } from 'react';

const useFileReader = ({ allowedTypes }) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null);
  const handleFileSelect = (event) => {
    const files = event.target.files;
    const _file = files[0];

    if (!_file) return;

    const fileType = _file.type.split('/')[0];

    if (allowedTypes && !allowedTypes.includes(fileType)) {
      setIsValid(false);
      setErrorMessage(
        `Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`
      );
      setFile(_file);
      return;
    }

    const validator = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (data) => {
          resolve();
          // Perform validation on the file data here
          // If it's valid, call resolve()
          // If it's not valid, call reject() with an error message
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file.'));
        };
        reader.readAsArrayBuffer(file);
      });
    };

    validator(file)
      .then(() => {
        setIsValid(true);
        setErrorMessage('');
      })
      .catch((error) => {
        setIsValid(false);
        setErrorMessage(error.message);
      });
  };

  return {
    handleFileSelect,
    file,
    isValid,
    errorMessage,
  };
};

export default useFileReader;
