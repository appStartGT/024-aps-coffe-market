import ApsDatagrid from '@components/ApsDatagrid';
import { Paper, FormControlLabel, Switch, Grid } from '@mui/material';
import useLoanList from '../hooks/useLoanList';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const LoanListPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    loanList,
    propsModalDeleteLoan,
    getAll,
    setGetAll,
  } = useLoanList();

  return (
    <>
      {propsModalDeleteLoan?.open && <ApsModal {...propsModalDeleteLoan} />}
      <Paper sx={stylesPaper}>
        <Grid container spacing={1} alignItems="center" /* sx={{ mb: 2 }} */>
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Switch checked={getAll} onChange={() => setGetAll(!getAll)} />
              }
              label="Ver todo"
            />
          </Grid>
          <Grid item xs={10}>
            <SearchBar {...propsSearchBarButton} />
          </Grid>
        </Grid>

        <ApsDatagrid
          rows={searchList || loanList}
          columns={columns}
          loading={processing}
          sxContainerProps={{
            height: 500,
          }}
          autoHeight={false}
        />
      </Paper>
    </>
  );
};

export default LoanListPage;
