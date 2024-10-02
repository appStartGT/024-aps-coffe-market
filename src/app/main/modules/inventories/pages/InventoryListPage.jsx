import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import { Paper } from '@mui/material';
import UseInventoriesList from '../hooks/UseInventoriesList';
import ApsModal from '@components/ApsModal';
import SearchBarEmployees from '@components/SearchBarEmployees';
/* import ExcelExportButton from '../components/ExcelExporter '; */
// import ApsModalLoading from '@components/ApsModalLoading';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const EmployeeListPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    inventoryList,
    // setPaginationModel,
    // paginationModel,
    // handlePageSizeChange,
    // pageSize,
    // handlePageChange,
    // totalItems,
    propsModalDeleteOrganization,
    /*   labels,
    fields, */
  } = UseInventoriesList();

  return (
    <GeneralContainer
      title="Inventarios"
      subtitle="Listado de inventerios de la organizacion."
      backTitle="Regresar"
      actions={[]}
      buttonProps={{}}
      // metaContent={

      // }
      container={
        <>
          {propsModalDeleteOrganization?.open && (
            <ApsModal {...propsModalDeleteOrganization} />
          )}

          <Paper sx={stylesPaper}>
            <SearchBarEmployees {...propsSearchBarButton} /* skeleton */ />
            <ApsDatagrid
              //skeleton
              rows={searchList || inventoryList}
              columns={columns}
              loading={processing}
              sxContainerProps={{
                height: 500,
              }}
              autoHeight={false}
              // onPageChange={handlePageChange}
              // onPageSizeChange={handlePageSizeChange}
              // pageSize={pageSize}
              // paginationModel={paginationModel}
              // onPaginationModelChange={setPaginationModel}
              // rowCount={totalItems}
              // paginationMode="server"
            />
          </Paper>
          {/* <ExcelExportButton
            data={searchList || inventoryList}
            customLabels={labels}
            fileName="Reporte Detallado"
            fields={fields}
          /> */}
        </>
      }
    />
  );
};

export default EmployeeListPage;
