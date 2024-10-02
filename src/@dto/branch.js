import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const branchModel = (branchSelected) => ({
  id: branchSelected.id_branch,
  id_branch: branchSelected.id_branch,
  id_organization: branchSelected.id_organization,
  name: branchSelected.name,
  address: branchSelected.address || '',
  email: branchSelected.email || '',
  description: branchSelected.description || '',
  nit: branchSelected.nit || '',
  telephone: branchSelected.telephone || '',
  photo: branchSelected.photo || '',
  file: branchSelected.file,
  createdAt: formatFirebaseTimestamp(branchSelected.createdAt),
});

export const branchList = (data) => {
  return data.map((item) => branchModel(item));
};

export const branchListForSelect = (data) => {
  return data.map((item) => ({
    // ...item,
    value: item.id_branch?.toString(),
    label: `${item.name}`,
  }));
};

export const branchGetOne = (branch) => branchModel(branch);

export const branchPut = (branch) => {
  const model = branchModel(branch);
  delete model.createdAt;
  return cleanModel(model);
};

export const updateListBranch = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_branch) {
      return branchModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
