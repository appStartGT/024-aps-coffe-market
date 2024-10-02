import React from 'react';

import { useState, useCallback } from 'react';
import { BlobProvider } from '@react-pdf/renderer';

const useGeneratePdfBlob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePdfBlob = useCallback((DocumentComponent, onComplete) => {
    setLoading(true);
    setError(null);

    const renderPdf = (
      <BlobProvider document={DocumentComponent}>
        {({ blob, loading, error }) => {
          if (loading) {
            return null;
          }
          if (blob) {
            setLoading(false);
            if (onComplete) {
              onComplete(blob);
            }
          }
          if (error) {
            setLoading(false);
            setError(error);
          }
          return null;
        }}
      </BlobProvider>
    );

    return renderPdf;
  }, []);

  return {
    generatePdfBlob,
    loading,
    error,
  };
};

export default useGeneratePdfBlob;
