import moment from 'moment';
import { cleanModel } from '@utils';
import { generateSearchTokens } from '@utils/firebaseMethods';

export const listProducts = (data) => {
  return data.map((item) => {
    return {
      ...parseProducts(item),
    };
  });
};

export const parseProducts = (pf) => {
  return {
    ...pf,
    id: pf.id_stock,
    expireAtFormated:
      moment.utc(pf?.product.expireAt).format('DD/MM/YYYY') ?? 'NO INGRESADA',
    unit_price: +pf?.product.unit_price,
    description: pf?.product.description || '',
    generic_name: pf?.product.generic_name || '',
    trade_name: pf?.product.trade_name || '',
    id_product: pf.id_product,
    quantity: calcQuantity(pf),
    barcode: pf?.product.barcode || '',
    id_provider: pf?.product.id_provider,
    sale_price: pf.sale_price || 0,
    discount: pf.discount || 0,
    id_product_measure_type: pf?.product.id_product_measure_type,
    units_per_measure: pf.units_per_measure || '',
    price_per_measure: pf.price_per_measure || '',
    sale_price_per_measure: pf.sale_price_per_measure || '',
    total_units: pf.total_units || 0,
    expireAt:
      moment.utc(pf?.product.expireAt).format('YYYY-MM-DD') ?? 'NO INGRESADA',
    id_category: pf?.product.id_category,
    id_stock: pf.id_stock,
    provider_name: pf?.product.provider.name,
    category_name: pf?.product.category.name,
    measureType_name: pf?.product.productMeasureType.name,
  };
};

export const updateProducts = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_stock) {
      return parseProducts({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};

export const calcQuantity = (pf) => {
  return +pf.quantity;
};

export const getProductPrice = (item) => {
  if (!item) return '0';
  return +item?.sale_price;
};

export const post = (data) => {
  const model = {
    key: 'id_product',
    name: data.name,
    barcode: data.barcode,
    description: data.description,
    expireAt: data.expireAt,
    isActive: data.isActive,
    quantity: data.quantity,
    sale_price: data.sale_price,
    unit_price: data.unit_price,
    id_category: data.category.value,
    id_product_measure_type: data.product_measure_type.value,
    id_provider: data.provider.value,
    units_per_measure: data.units_per_measure,
    id_organization: data.id_organization,
    percent: data.percent,

    photoMetadata: data.photoMetadata,
    photo: data.photo, //photo url
    searchTokens: generateSearchTokens(data.name),
    isCombo: data?.isCombo || false,
    comboProducts: data?.comboProducts,
  };

  return cleanModel(model);
};

export const get = (data) => {
  if (Array.isArray(data)) {
    const obj = data.map((product) => ({
      ...product,
      id: product?.id_product || product.id,
      id_product: product?.id_product || product.id,

      category: {
        ...product?.category,
        value: product?.category?.id,
        label: product?.category?.name,
      },
      product_measure_type: {
        ...product?.product_measure_type,
        value: product?.product_measure_type?.id,
        label: product?.product_measure_type?.name,
      },
      provider: {
        ...product?.provider,
        value: product?.provider?.id,
        label: product?.provider?.name,
      },
      //Autocomplete searchable options
      value: product?.id_product,
      label: product.name,
      isCombo: product?.isCombo || false,
      comboProducts: product?.comboProducts || [],
    }));

    return obj;
  }
  return {
    ...data,
    id: data?.id_product || data.id,
    id_product: data?.id_product || data.id,
    category: {
      ...data?.category,
      value: data?.category?.id,
      label: data?.category?.name,
    },
    product_measure_type: {
      ...data?.product_measure_type,
      value: data?.product_measure_type?.id,
      label: data?.product_measure_type?.name,
    },
    provider: {
      ...data?.provider,
      value: data?.provider?.id,
      label: data?.provider?.name,
    },
    isCombo: data?.isCombo || false,
    comboProducts: data?.comboProducts || [],
  };
};

export const put = (data) => {
  let prepareData = {};

  try {
    prepareData.id = data?.id_product || null;
    prepareData.id_product = data?.id_product || null;
    prepareData.name = data?.name || '';
    prepareData.barcode = data?.barcode || '';
    prepareData.description = data?.description || '';
    prepareData.expireAt = data?.expireAt || null;
    prepareData.isActive =
      typeof data?.isActive === 'boolean' ? data.isActive : null;

    prepareData.quantity = data?.quantity ? parseInt(data.quantity, 10) : 0;

    prepareData.sale_price = data?.sale_price ? parseFloat(data.sale_price) : 0;

    prepareData.unit_price = data?.unit_price ? parseFloat(data.unit_price) : 0;

    prepareData.id_category = data?.category?.value || null;
    prepareData.id_product_measure_type =
      data?.product_measure_type?.value || null;
    prepareData.id_provider = data?.provider?.value || null;

    prepareData.units_per_measure = data?.units_per_measure
      ? parseInt(data.units_per_measure, 10)
      : null;

    prepareData.percent = typeof data?.percent === 'number' ? data.percent : 0;
    prepareData.photoMetadata = data?.photoMetadata || null;
    prepareData.photo = data?.photo || '';
    prepareData.searchTokens = Array.isArray(data?.searchTokens)
      ? data.searchTokens
      : [];
    prepareData.isCombo = data?.isCombo || false;
    prepareData.comboProducts = data?.comboProducts || [];

    return cleanModel(prepareData);
  } catch (error) {
    console.error('Error durante la preparación de datos:', error);
    console.log('Datos en el punto de fallo:', prepareData);
  }
  return cleanModel(prepareData);
};
