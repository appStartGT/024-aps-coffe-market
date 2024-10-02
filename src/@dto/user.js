import { cleanModel, validateBoolean } from '@utils';
import moment from 'moment';

export const post = (data) => {
  let model = {
    id_user_type: data.id_user_type,
    id_organization: data.id_organization,
    id_branch: data.id_branch,
    names: data.names,
    surNames: data.surNames,
    email: data.email,
    id_role: data.id_role,
    password: data.password,
    phone: data.phone,
    photoMetadata: data.photoMetadata,
    photo: data.photo, //photo url
    DPI: data.DPI,
    NIT: data.NIT,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    isActive: data.isActive,
  };

  return cleanModel(model);
};

export const put = (data) => {
  let model = {
    id_user_type: data.id_user_type,
    id_organization: data.id_organization,
    id_branch: data.id_branch,
    id_user: data.id_user,
    names: data.names,
    surNames: data.surNames,
    email: data.email,
    id_role: data.id_role,
    password: data.password,
    phone: data.phone,
    photo: data.photo,
    photoMetadata: data.photoMetadata,
    DPI: data.DPI,
    NIT: data.NIT,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    isActive: data.isActive,
  };

  return cleanModel(model);
};

const parseUserModel = (user) => {
  const obj = {
    id: user.id_user,
    id_user: user.id_user,
    id_user_assistent: user?.userAssistant?.id_user,
    name: `${user.names || ''} ${user.surNames || ''}`,
    email: user.email || '',
    photo: user.photo || '',
    photoMetadata: user?.photoMetadata,
    isActive: validateBoolean(user.isActive),
    id_role: { value: user.id_role.id, label: user.id_role.name },
    rol: user.id_role.name,
    phone: user.phone || '',
    names: user.names || '',
    surNames: user.surNames || '',
    DPI: user.DPI || '',
    NIT: user.NIT || '',
    address: user.address || '',
    dateOfBirth: user.dateOfBirth
      ? moment.utc(user.dateOfBirth).format('YYYY-MM-DD')
      : '',
    theme: user.theme,
    password: user.password,
  };
  return obj;
};

export const get = (data) => {
  if (Array.isArray(data)) {
    return data.map((user) => parseUserModel(user));
  }
  return parseUserModel(data);
};
