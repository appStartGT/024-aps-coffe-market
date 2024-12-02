import React from 'react';
import ApsDatagrid from '@components/ApsDatagrid';
import {
  Paper,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import DataTableOverview from '../components/DataTableOverview';
import { formatNumber } from '@utils';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseDetailPricelessPage = () => {
  const {
    processing,
    columns,
    searchList,
    purchaseListPriceless,
    selectionModel,
    setSelectionModel,
    totalSelectedQuantity,
    handleRemate,
    getAll,
    setGetAll,
  } = usePurchaseDetail();

  const totalSelectedQuintales = totalSelectedQuantity / 100;

  return (
    <Paper sx={PAPER_STYLES}>
      <DataTableOverview purchaseList={purchaseListPriceless} />

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          control={
            <Switch checked={getAll} onChange={() => setGetAll(!getAll)} />
          }
          label="Ver todo"
        />
        {selectionModel.length > 0 && (
          <>
            <Typography variant="body1">
              Total seleccionado: {formatNumber(totalSelectedQuantity)} lb (
              {formatNumber(totalSelectedQuintales)} qq)
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRemate}>
              Remate
            </Button>
          </>
        )}
      </Box>

      <ApsDatagrid
        rows={searchList || purchaseListPriceless}
        columns={columns}
        loading={processing}
        sxContainerProps={{ height: 500 }}
        autoHeight={false}
        checkboxSelection
        onSelectionModelChange={setSelectionModel}
        selectionModel={selectionModel}
        isRowSelectable={(params) => !params.row.isRemate}
      />
    </Paper>
  );
};

export default PurchaseDetailPricelessPage;
