import { cleanModel } from '@utils';

const model = (data) => ({
  id: data?.id_role || data.id,
  id_role: data?.id_role || data.id,
  name: data.name,
  description: data.description,
  isActive: data.isActive,
  permissions: data.permissions,
});

export const post = (data) => {
  return cleanModel({ ...model(data), key: 'id_role' });
};

export const put = (data) => cleanModel(model(data));

export const get = (data) => {
  if (Array.isArray(data)) {
    return data.map(model);
  }
  return model(data);
};
