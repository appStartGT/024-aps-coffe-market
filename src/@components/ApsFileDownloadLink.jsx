import React from 'react';
// import { getFIleFromURL } from '@utils';

// const handleDownload = async () => {
//   try {
//     await getFIleFromURL();
//   } catch (error) {
//     console.log(error);
//   }
// };

function ApsFileDownloadLink({ url, /* fileName, */ children }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer" /* onClick={handleDownload} */
    >
      {children}
    </a>
  );
}

export default ApsFileDownloadLink;
