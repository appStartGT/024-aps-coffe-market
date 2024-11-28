import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import { Paper } from '@mui/material';
import useExpensesList from '../hooks/useExpensesList';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const ExpensesListPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    expensesList,
    propsModalDeleteExpense,
  } = useExpensesList();

  return (
    <GeneralContainer
      title="Gastos Operativos"
      subtitle="Listado de gastos operativos."
      backTitle="Volver"
      actions={[]}
      buttonProps={{}}
      container={
        <>
          {propsModalDeleteExpense?.open && (
            <ApsModal {...propsModalDeleteExpense} />
          )}

          <Paper sx={stylesPaper}>
            {/* <DataTableOverview expensesList={expensesList} /> */}
            <SearchBar {...propsSearchBarButton} />
            <ApsDatagrid
              rows={searchList || expensesList}
              columns={columns}
              loading={processing}
              sxContainerProps={{
                height: 500,
              }}
              autoHeight={false}
            />
          </Paper>
        </>
      }
    />
  );
};

export default ExpensesListPage;
