import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const employeeModel = (employee) => {
  const obj = {
    id: employee.id_employee,
    id_employee: employee.id_employee,
    name: employee.name,
    address: employee.address || '',
    email: employee.email || '',
    description: employee.description || '',
    nit: employee.nit || '',
    telephone: employee.telephone || '',
    photo: employee.photo || '',
    photoMetadata: employee.photoMetadata,
    id_organization: employee?.id_organization?.id ?? employee?.id_organization,
    createdAt: formatFirebaseTimestamp(employee.createdAt),
    payments:
      employee?.payments?.map((payment) => ({
        ...payment,
        onlyMonth: payment?.month?.label || 'Indefinido', // Asegura que no truene si month o label no existen
      })) || [],
    banco: employee.banco || '',
    tipo_cuenta: employee.tipo_cuenta || '',
    salario: employee?.salario || '',
    cuenta: employee.cuenta || '',
    branch: {
      value: employee?.id_branch?.id ?? employee?.id_branch,
      label: employee.branch?.name ?? employee.branch?.label,
    },
    sucursal: employee.branch?.name || 'NO ASIGANDO',
    job: employee?.job || '',
    id_branch: employee?.id_branch?.id ?? employee?.id_branch,
  };
  return obj;
};

export const employeeList = (data) => {
  return data.map((item) => employeeModel(item));
};

export const organizationGetOne = (employee) => employeeModel(employee);

export const organizationPut = (employee) => {
  const model = employeeModel(employee);
  delete model.createdAt;
  delete model.id;
  delete model.file;
  return cleanModel(model);
};

export const updateListOrganization = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_employee) {
      return employeeModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
