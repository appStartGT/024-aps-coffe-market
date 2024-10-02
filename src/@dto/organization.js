import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const organizationModel = (organization) => {
  const obj = {
    id: organization.id_organization,
    id_organization: organization.id_organization,
    name: organization.name,
    address: organization.address || '',
    email: organization.email || '',
    description: organization.description || '',
    nit: organization.nit || '',
    telephone: organization.telephone || '',
    photo: organization.photo || '',
    photoMetadata: organization.photoMetadata,
    createdAt: formatFirebaseTimestamp(organization.createdAt),
  };
  return obj;
};

export const organizationList = (data) => {
  return data.map((item) => organizationModel(item));
};

export const organizationGetOne = (organization) =>
  organizationModel(organization);

export const organizationPut = (organization) => {
  const model = organizationModel(organization);
  delete model.createdAt;
  delete model.id;
  delete model.file;
  return cleanModel(model);
};

export const updateListOrganization = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_organization) {
      return organizationModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
