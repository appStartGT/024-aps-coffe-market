import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import { Paper } from '@mui/material';
import UseEmployeeList from '../hooks/UseEmployeeList';
import ApsModal from '@components/ApsModal';
import SearchBarEmployees from '@components/SearchBarEmployees';
import ExcelExportButton from '../components/ExcelExporter ';
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
    employeeList,
    // setPaginationModel,
    // paginationModel,
    // handlePageSizeChange,
    // pageSize,
    // handlePageChange,
    // totalItems,
    propsModalDeleteOrganization,
    labels,
    fields,
  } = UseEmployeeList();

  return (
    <GeneralContainer
      title="Empleados"
      subtitle="Listado de empleados."
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
              rows={searchList || employeeList}
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
          <ExcelExportButton
            data={searchList || employeeList}
            customLabels={labels}
            fileName="Reporte Detallado"
            fields={fields}
          />
        </>
      }
    />
  );
};

export default EmployeeListPage;
