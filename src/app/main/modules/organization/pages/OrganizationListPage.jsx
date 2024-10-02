import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import SearchBar from '@components/SearchBar';
import { Paper } from '@mui/material';
import useOrganizationList from '../hooks/useOrganizationList';
import ApsModal from '@components/ApsModal';
// import ApsModalLoading from '@components/ApsModalLoading';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const OrganizationListPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    organizationList,
    // setPaginationModel,
    // paginationModel,
    // handlePageSizeChange,
    // pageSize,
    // handlePageChange,
    // totalItems,
    propsModalDeleteOrganization,
  } = useOrganizationList();

  return (
    <GeneralContainer
      title="Organizaciones"
      subtitle="Listado de organizaciones."
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
            <SearchBar {...propsSearchBarButton} /* skeleton */ />
            <ApsDatagrid
              //skeleton
              rows={searchList || organizationList}
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
        </>
      }
    />
  );
};

export default OrganizationListPage;
