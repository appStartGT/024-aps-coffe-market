import SearchBar from '@components/SearchBar';
import ApsDatagrid from '@components/ApsDatagrid';
import ApsModal from '@components/ApsModal';
import useProductosList from '../hooks/useProductosList';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import { Paper } from '@mui/material';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const ProductosList = () => {
  const {
    registrosListMedicamentos,
    propsSearchBarButtonMedicamentos,
    columnsMedicamentos,
    propsModalRegistroProducto,
    propsModalDelete,
    loading,
    // handlePageChange,
    // handlePageSizeChange,
    // pageSize,
    // paginationModel,
    // setPaginationModel,
    // totalItems,
    propsModalRegistroProvider,
    propsModalRegistroCategory,
    propsModalRegistroProductMeasureType,
    searchList,
  } = useProductosList();

  return (
    <GeneralContainer
      title="Producto"
      // subtitle="Módulo de producto donde están todos los productos para ventas de la tienda, servicios y uso interno."
      actions={[]}
      buttonProps={{}}
      container={
        <Paper sx={stylesPaper}>
          <SearchBar {...propsSearchBarButtonMedicamentos} />
          <ApsDatagrid
            rows={searchList || registrosListMedicamentos}
            columns={columnsMedicamentos}
            loading={loading}
            /*  
            onPageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPaginationModelChange={setPaginationModel} */
            /*   paginationModel={paginationModel} */
            // pagination
            // rowCount={totalItems}
            // paginationMode="server"
            sxContainerProps={{
              height: 500,
            }}
            autoHeight={false}
          />
          {propsModalRegistroProducto.open && (
            <ApsModal {...propsModalRegistroProducto} />
          )}
          {propsModalDelete?.open && <ApsModal {...propsModalDelete} />}
          {propsModalRegistroProvider.open && (
            <ApsModal {...propsModalRegistroProvider} />
          )}
          {propsModalRegistroCategory.open && (
            <ApsModal {...propsModalRegistroCategory} />
          )}
          {propsModalRegistroProductMeasureType.open && (
            <ApsModal {...propsModalRegistroProductMeasureType} />
          )}
        </Paper>
      }
    />
  );
};

export default ProductosList;
