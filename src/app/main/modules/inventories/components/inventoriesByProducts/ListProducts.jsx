import ApsDatagrid from '@components/ApsDatagrid';

import { Paper } from '@mui/material';
import useTabListInventoryProduct from '../inventoriesByProducts/UseListProductInventory';
import SearchBar from '@components/SearchBar';
import ApsModal from '@components/ApsModal';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const ListProduct = () => {
  const {
    registrosListProductsInventory,
    propsSearchBarButtonMedicamentos,
    columnsProductsInventory,
    propsModalDelete,
    loading,
    searchList,
    propsModalStep,
    propsModalEdit,
  } = useTabListInventoryProduct();

  return (
    <Paper sx={stylesPaper}>
      <SearchBar {...propsSearchBarButtonMedicamentos} />
      <ApsDatagrid
        rows={searchList || registrosListProductsInventory || []}
        columns={columnsProductsInventory}
        loading={loading}
        sxContainerProps={{
          height: 500,
        }}
        autoHeight={false}
      />

      {propsModalDelete?.open && <ApsModal {...propsModalDelete} />}

      {propsModalStep?.open && <ApsModal {...propsModalStep} />}
      {propsModalEdit?.open && <ApsModal {...propsModalEdit} />}
    </Paper>
  );
};

export default ListProduct;
