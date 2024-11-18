import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
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
  } = useLoanList();

  return (
    <>
      {propsModalDeleteLoan?.open && <ApsModal {...propsModalDeleteLoan} />}
      <Paper sx={stylesPaper}>
        <SearchBar {...propsSearchBarButton} />
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
