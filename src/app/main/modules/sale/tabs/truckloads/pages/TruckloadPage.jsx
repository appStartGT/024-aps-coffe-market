import ApsDatagrid from '@components/ApsDatagrid';
import { Box, Paper, Typography, Button } from '@mui/material';
import useTruckload from '../hooks/useTruckload';
import DataTableOverview from '../components/DataTableOverview';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const TruckloadPage = () => {
  const {
    processing,
    columns,
    searchList,
    truckloadList,
    selectionModel,
    setSelectionModel,
    handleRemate,
    totalReceivedSelected,
  } = useTruckload();

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataTableOverview truckloadList={truckloadList} />
        {/* <SearchBar {...propsSearchBarButton} /> */}
        {selectionModel.length > 0 && totalReceivedSelected > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography>
              Total ( Lb recibidas): {totalReceivedSelected.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRemate(selectionModel)}
            >
              Remate
            </Button>
          </Box>
        )}
        <ApsDatagrid
          rows={searchList || truckloadList}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          isRowSelectable={(params) =>
            !params.row.isSold && +params.row.totalReceived > 0
          }
        />
      </Paper>
    </>
  );
};

export default TruckloadPage;
