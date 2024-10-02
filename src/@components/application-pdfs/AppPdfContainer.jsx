import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ApsIconButton from '@components/ApsIconButton';
import { Download } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const AppPdfContainer = ({ content, title }) => {
  const downloadButton = (
    <PDFDownloadLink document={content} fileName={`${title}.pdf`}>
      {({ loading }) =>
        loading ? (
          <CircularProgress />
        ) : (
          <ApsIconButton
            tooltip={{ title: 'Descargar comprobante' }}
            children={<Download />}
          />
        )
      }
    </PDFDownloadLink>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {downloadButton}
    </div>
  );
};

export default AppPdfContainer;
