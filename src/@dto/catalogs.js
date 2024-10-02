import { cleanModel } from '@utils';

export const list = ({ data, valueKey, nameKey = 'name' }) => {
  return data.map((item) => ({
    //...item,
    value: item[valueKey]?.toString(),
    label: item[nameKey],
  }));
};
/* 
export const list = ({ data, valueKey, nameKey = 'name' }) => {
  return data.map((item) => ({
    // ...item,
    value: item[valueKey]?.toString(),
    label: item[nameKey],
  }));
}; */

export const listProductMeasure = ({
  data,
  valueKey,
  nameKey = 'name',
  validation_id = 'validation_id',
}) => {
  return data.map((item) => ({
    // ...item,
    value: item[valueKey]?.toString(),
    label: item[nameKey],
    validation_id: item[validation_id] ?? 0,
  }));
};

export const listPerson = ({ data, valueKey }) => {
  return data.map((item) => ({
    // ...item,
    value: item[valueKey]?.toString(),
    label: `${item.names} ${item.surNames}`,
  }));
};

export const listUser = ({ data, valueKey }) => {
  return data.map((item) => ({
    // ...item,
    value: item[valueKey]?.toString(),
    label: `${item.names} ${item.surNames}`, // ( ${item.email} )
  }));
};

export const postProvider = (data) => {
  const model = {
    key: 'id_provider',
    name: data.name,
    description: data?.description || 'No Ingresado',
    nit: data?.nit || 'No Ingresado',
    phoneNumber: data?.phoneNumber || 'No Ingresado',
    email: data?.email || 'No Ingresado',
    address: data?.address || 'No Ingresado',
    isActive: data.isActive,
    id_organization: data?.id_organization,
  };

  return cleanModel(model);
};

export const postCatagory = (data) => {
  const model = {
    key: 'id_category',
    name: data.name,
    isActive: data.isActive,
    id_organization: data?.id_organization,
  };

  return cleanModel(model);
};

export const postProductMeasureType = (data) => {
  const model = {
    key: 'id_product_measure_type',
    name: data.name,
    isActive: data.isActive,
    id_organization: data?.id_organization,
    validation_id: data.name.toLowerCase() === 'unidad' ? 1 : 0,
  };

  return cleanModel(model);
};

export const getRol = (data) => {
  if (Array.isArray(data)) {
    return data.map((role) => ({
      id: role?.id_role || role.id,
      id_role: role?.id_role || role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
    }));
  }
  return {
    id: data?.id_role || data.id,
    id_role: data?.id_role || data.id,
    name: data.name,
    description: data.description,
    isActive: data.isActive,
  };
};

export const getProvider = (data) => {
  if (Array.isArray(data)) {
    return data.map((provider) => ({
      id: provider?.id_provider || provider.id,
      id_provider: provider?.id_provider || provider.id,
      name: provider.name,
      isActive: provider.isActive,
      description: provider?.description,
      nit: provider?.nit,
      phoneNumber: provider?.phoneNumber,
      email: provider?.email,
      address: provider?.address,
      label: provider.name,
      value: provider?.id_provider || data.id,
    }));
  }
  return {
    id: data?.id_provider || data.id,
    id_provider: data?.id_provider || data.id,
    name: data.name,
    isActive: data.isActive,
    description: data?.description,
    nit: data?.nit,
    phoneNumber: data?.phoneNumber,
    email: data?.email,
    address: data?.address,
    label: data.name,
    value: data?.id_provider || data.id,
  };
};

export const getCatGender = (data) => {
  if (Array.isArray(data)) {
    return data.map((gender) => ({
      id: gender?.id_gender || gender.id,
      id_gender: gender?.id_gender || gender.id,
      name: gender.name,
      isActive: gender.isActive,
      label: gender.name,
      value: gender?.id_gender || gender.id,
    }));
  }
  return {
    id: data?.id_gender || data.id,
    id_gender: data?.id_gender || data.id,
    name: data.name,
    isActive: data.isActive,
    label: data.name,
    value: data?.id_gender || data.id,
  };
};

export const getCatProductMeasure = (data) => {
  if (Array.isArray(data)) {
    return data.map((proMeasure) => ({
      id: proMeasure?.id_product_measure_type || proMeasure.id,
      id_product_measure_type:
        proMeasure?.id_product_measure_type || proMeasure.id,
      name: proMeasure.name,
      isActive: proMeasure.isActive,
      label: proMeasure.name,
      value: proMeasure?.id_product_measure_type || proMeasure.id,
    }));
  }
  return {
    id: data?.id_product_measure_type || data.id,
    id_product_measure_type: data?.id_product_measure_type || data.id,
    name: data.name,
    isActive: data.isActive,
    label: data.name,
    value: data?.id_product_measure_type || data.id,
  };
};
