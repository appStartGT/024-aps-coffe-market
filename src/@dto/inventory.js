import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const inventoryModel = (inventory) => {
  const obj = {
    id: inventory.id_inventory,
    id_inventory: inventory.id_inventory,
    name: inventory.name,
    id_organization: inventory?.id_organization,
    createdAt: formatFirebaseTimestamp(inventory.createdAt),
    branch: inventory.branch?.name,
    sucursal: inventory.branch?.name || 'NO ASIGANDO',
    id_branch: inventory?.id_branch,
    description: inventory?.description,
  };

  return obj;
};

export const inventoryList = (data) => {
  return data.map((item) => inventoryModel(item));
};

export const inventoryGetOne = (inventory) => inventoryModel(inventory);

export const organizationPut = (inventory) => {
  const model = inventoryModel(inventory);
  delete model.createdAt;
  delete model.id;
  delete model.file;
  return cleanModel(model);
};

export const updateListOrganization = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_inventory) {
      return inventoryModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};

const ProductInventoryModel = (inventory) => {
  const obj = {
    /*  id: inventory.id_inventory,
    id_inventory: inventory.id_inventory,
    name: inventory.name,
    id_organization: inventory?.id_organization?.id,
    createdAt: formatFirebaseTimestamp(inventory.createdAt),
    branch: inventory.id_branch.name,
    sucursal: inventory.branch?.label || 'NO ASIGANDO',
    id_branch: inventory?.id_branch?.id,
    description: inventory?.description, */
    ...inventory,
  };

  return obj;
};

export const inventoryProductList = (data) => {
  return data.map((item) => ProductInventoryModel(item));
};
