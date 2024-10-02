import moment from 'moment';

export const listMedicamentos = (data) => {
  return data.map((item) => parseMedicamentoSaleGet({ item }));
};

export const parseMedicamentoSaleGet = ({ item, formatDate = true }) => {
  return {
    ...item,
    id: item.id_sale,
    createdAt: formatDate
      ? moment(item.createdAt).format('DD/MM/YYYY')
      : item.createdAt,
    client: `${item.person?.names} ${item.person?.surNames}`,
    NIT: item.person?.NIT || 'No ingresado',
    products: item.saleDetail.map((producto) => ({
      name: `${producto.product?.generic_name} (${producto.product?.trade_name}) P.U. Q${producto?.sale_price} X ${producto?.quantity}`,
      subtotal: +producto?.sale_price * +producto?.quantity,
      deleted: producto.product.deleted,
    })),
  };
};

export const parsePharmacySaleSavePre = (vf) => {
  return {
    names: vf.names,
    surNames: vf.surNames,
    address: vf.address || '',
    NIT: vf.NIT,
    description: vf.description,
    detail: vf.detail,
  };
};

export const updatePharmacySaleDetail = (oldData, updatedEntry) => {
  return oldData.map((fcd) => {
    if (fcd.id_sale == updatedEntry.id_sale) {
      return parseMedicamentoSaleGet({
        item: {
          ...fcd,
          total: updatedEntry.total,
          saleDetail: [...fcd.saleDetail, ...updatedEntry.saleDetail],
        },
        formatDate: false,
      });
    } else {
      return fcd;
    }
  });
};
