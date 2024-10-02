import { cleanModel } from '@utils';
import moment from 'moment';

export const post = (data) => {
  let model = {
    names: data.names,
    surNames: data.surNames,
    phone: data.phone,
    DPI: data.DPI,
    NIT: data.NIT,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    isExternal: data.isExternal,
    id_person_type: data.id_person_type || '',
  };

  return cleanModel(model);
};

export const put = (data) => {
  let model = {
    id_person: data.id_person,
    id_person_type: data.id_person_type,
    names: data.names,
    surNames: data.surNames,
    phone: data.phone,
    DPI: data.DPI,
    NIT: data.NIT,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    isExternal: data.isExternal,
  };

  return cleanModel(model);
};

const parseUserModel = (person) => ({
  id: person.id_person,
  id_person: person.id_person,
  id_person_type: person.id_person_type,
  type: person.personType ? person.personType.name : '',
  phone: person.phone || '',
  names: person.names || '',
  fullName: `${person.names || ''} ${person.surNames || ''}`,
  surNames: person.surNames || '',
  DPI: person.DPI || '',
  NIT: person.NIT || '',
  address: person.address || '',
  dateOfBirth: person.dateOfBirth
    ? moment.utc(person.dateOfBirth).format('YYYY-MM-DD')
    : '',
});

export const get = (data) => {
  if (Array.isArray(data)) {
    return data.map((user) => parseUserModel(user));
  }
  return parseUserModel(data);
};
