import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Download } from '@mui/icons-material';
import { reportsVaccinePatientAction } from '../../../../../../store/modules/reports';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { BlobProvider } from '@react-pdf/renderer';
import PDFHistoricoVacunasConAlgo from '@components/application-pdfs/PDFHistoricoVacunasColumnas';

const useDownloadVaccinesReport = ({ nombrePaciente, title = '' }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const reportVacunas = useSelector((state) => state.reports.vaccinesPatient);
  const processing = useSelector((state) => state.reports.processing);
  const { id_medical_record } = useParams();
  const hasDownloaded = useRef(false);

  const handleOpenModalin = () => {
    dispatch(reportsVaccinePatientAction(id_medical_record)).then(() => {
      setOpen(true);
      setPdfUrl(null);
      hasDownloaded.current = false;
    });
  };

  const dataContent = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CircularProgress color="primary" />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography>{title || 'Espere un momento'}</Typography>
          </div>
        </Grid>
        {open && reportVacunas && (
          <BlobProvider
            document={
              <PDFHistoricoVacunasConAlgo
                nombrePaciente={nombrePaciente}
                content={reportVacunas}
              />
            }
          >
            {({ url }) => {
              if (url && !pdfUrl) {
                handleDownloadClick(url);
              }
              return null;
            }}
          </BlobProvider>
        )}
      </Grid>
    );
  };

  const propsModalVaccineReport = {
    open: open,
    onClose: () => handleClose(),
    maxWidth: 'md',
    title: null,
    description: null,
    content: dataContent(),
    handleOk: null,
    titleOk: null,
    handleCancel: null,
    titleCancel: null,
    okProps: {
      disabled: processing,
      endIcon: <Download />,
    },
  };

  const handleDownloadClick = (url) => {
    if (!pdfUrl && !hasDownloaded.current) {
      setPdfUrl(url);
      window.open(url, '_blank');
      setOpen(false);
      hasDownloaded.current = true;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && reportVacunas) {
      setPdfUrl(null);
      hasDownloaded.current = false;
    }
  }, [open, reportVacunas]);

  return {
    propsModalVaccineReport,
    handleOpenModalin,
  };
};

export default useDownloadVaccinesReport;
