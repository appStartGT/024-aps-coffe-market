import PDFTicket from '@components/application-pdfs/PDFFactura';
import ApsIconButton from '@components/ApsIconButton';
import { Print } from '@mui/icons-material';
import { BlobProvider } from '@react-pdf/renderer';
import { useRef } from 'react';

const InvoicePdfButton = ({ row, /* children */ onFinish }) => {
  const iframeRef = useRef(null);

  return (
    <BlobProvider document={<PDFTicket content={row} />}>
      {({ blob, url, loading, error }) => {
        if (blob && !loading) {
          // window.open(url, '_blank');
          // setGeneratePDF(null);
          onFinish && onFinish(blob, url);
          // console.log('rede');
          return (
            <ApsIconButton
              tooltip={{ title: 'Generar pdf' }}
              children={<Print />}
              onClick={() => {
                if (!iframeRef.current) {
                  iframeRef.current = document.createElement('iframe');
                  document.body.appendChild(iframeRef.current);
                  iframeRef.current.style.display = 'none';
                }
                iframeRef.current.src = url;

                iframeRef.current.onload = () => {
                  iframeRef.current.contentWindow.print();
                };
              }}
            />
          );
        }
        if (error) {
          console.error('Error generating PDF:', error);
          return null;
        }
        return null;
      }}
    </BlobProvider>
  );
};

export default InvoicePdfButton;
