import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const inventoryModel = (inventory) => {
  const obj = {
    ...inventory,
    id: inventory.id_inventory_branch,
    id_inventory_branch: inventory.id_inventory_branch,
    name: inventory.product?.name || inventory?.id_product?.name,
    id_organization:
      inventory?.organization?.id_organization ||
      inventory?.id_organization?.id_organization,
    createdAt: formatFirebaseTimestamp(inventory.createdAt),
    branch: inventory.branch?.name || inventory?.id_branch?.name,
    id_branch: inventory?.branch?.id_branch || inventory?.id_branch?.id_branch,
    photo: inventory.product?.photo || inventory?.id_product?.photo,
    sale_price: inventory?.sale_price,
    quantity: inventory?.quantity,
    id_product_measure_type: inventory?.product?.product_measure_type?.name
      ? {
          ...inventory?.product?.product_measure_type,
          label: inventory?.product?.product_measure_type?.name,
        }
      : {
          ...inventory?.id_product?.id_product_measure_type,
          label: inventory?.id_product?.id_product_measure_type?.name,
        },
    expireAt: inventory?.expireAt || null,
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
    if (ce.id == updatedEntry.id_inventory_branch) {
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

export const addCreateNew = (productInventoryList, organization) => {
  // Verificar si la data es un arreglo
  if (!Array.isArray(productInventoryList) || !Array.isArray(organization)) {
    throw new Error('Ambos argumentos deben ser arreglos.');
  }

  // Combinar los dos arreglos
  const updatedList = [...productInventoryList, ...organization];

  // Si deseas eliminar duplicados, puedes usar un Map para asegurar la unicidad basada en el ID del producto
  const uniqueList = Array.from(
    new Map(updatedList.map((item) => [item.id, item])).values()
  );

  return uniqueList;
};
