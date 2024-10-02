import {
  cleanModel,
  firebaseCollectionsKey,
  firebaseMethods,
  dates,
} from '@utils';
const { generateSearchTokens } = firebaseMethods;
const { formatFirebaseTimestamp } = dates;

const calculateSubtotal = (item) => {
  const quantity = item.quantity || 0;
  const price = parseFloat(item.sale_price.replace('Q', ''));
  return quantity * price;
};

const calculateTotal = (items) => {
  const total = items.reduce((total, item) => {
    return total + calculateSubtotal(item);
  }, 0);
  return total;
};

const saleDetailModel = (detail = []) => {
  const newDetail = detail.map((det) =>
    cleanModel({
      id_product: det.id_product.id_product,
      id_inventory: det.id_inventory.id_inventory,
      id_inventory_branch: det.id_inventory_branch,
      name: det.name,
      quantity: +det.quantity,
      sale_price: det.sale_price,
      mayor_sale_price: det.mayor_sale_price,
      subTotal: +det.quantity * +det.sale_price,
    })
  );

  return [...newDetail];
};

const salePostModel = (data) =>
  cleanModel({
    key: firebaseCollectionsKey.sale,
    // id: data.id_sale,
    id_organization: data.id_organization,
    id_branch: data.id_branch,
    names: data.names,
    surNames: data.surNames,
    address: data.address,
    email: data.email,
    NIT: data.NIT,
    phone: data.phone,
    description: data.description,
    searchTokens: [
      ...generateSearchTokens(data.names),
      ...generateSearchTokens(data.surNames),
      ...generateSearchTokens(data.email),
      ...generateSearchTokens(data.NIT),
      ...generateSearchTokens(data.phone),
    ],
    detail: saleDetailModel(data.detail),
    /* When the product is a combo, add the quantity of each product that is part of the combo */
    comoboProducts: data.detail.reduce((acc, item) => {
      if (item.quantityProduct) {
        acc.push(
          ...item.quantityProduct.map((product) => ({
            ...product,
          }))
        );
      }
      return acc;
    }, []),
    total: calculateTotal(data.detail),
  });

const saleGetModel = (data) =>
  cleanModel({
    id: data.sale.id_sale,
    id_sale: data.sale.id_sale,
    client: `${data.sale.names || ''} ${data.sale.surNames || ''}`,
    names: data.sale.names || '',
    surNames: data.sale.surNames || '',
    address: data.sale.address || 'Sin dirección',
    email: data.sale.email || '',
    NIT: data.sale.NIT || 'C/F',
    phone: data.sale.phone || '',
    description: data.sale.description || '',
    total: data.sale.total,
    createdAt: data.sale.createdAt,
    createdAtFormated: formatFirebaseTimestamp(data.sale.createdAt),
    deleted: data.sale.deleted,
  });

export const post = (data) => salePostModel(data);
export const list = (data) => {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.id_sale]) {
      acc[item.id_sale] = {
        ...saleGetModel(item),
        detail: [],
      };
    }
    acc[item.id_sale].detail.push(item);
    return acc;
  }, {});

  return Object.values(groupedData);
};
export const getOne = (data) => saleGetModel(data);
