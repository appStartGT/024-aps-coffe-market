export const activeSelectOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
];

export const personType = {
  PACIENTE: 1,
  PROPIETARIO: 2,
  DOCTOR: 3,
};

export const statusHospitalRecord = {
  INGRESADO: 1,
  POR_PAGAR: 2,
  PAGADO: 3,
};

export const serviceType = {
  CONSULTA: '1',
  HOSPITALIZACION: '2',
};

export const meses = [
  {
    value: 0,
    label: 'Enero',
  },
  {
    value: 1,
    label: 'Febrero',
  },
  {
    value: 2,
    label: 'Marzo',
  },
  {
    value: 3,
    label: 'Abril',
  },
  {
    value: 4,
    label: 'Mayo',
  },
  {
    value: 5,
    label: 'Junio',
  },
  {
    value: 6,
    label: 'Julio',
  },
  {
    value: 7,
    label: 'Agosto',
  },
  {
    value: 8,
    label: 'Septiembre',
  },
  {
    value: 9,
    label: 'Octubre',
  },
  {
    value: 10,
    label: 'Noviembre',
  },
  {
    value: 11,
    label: 'Diciembre',
  },
];

export const pharmacySalesRecords = {
  GET_HOSPITAL_RECORDS: 1,
};

export const socketEvent = {
  REFRESH_HOSPITALARIO: 'REFRESH_HOSPITALARIO',
};

export const idsLocationType = {
  FARMACIA: 1,
  SERVICIO: 2,
  USO_INTERNO: 3,
};

export const productMeasureType = {
  UNIDAD: 'unidad',
};

export const CatUserType = {
  SYSTEM: 1,
  ORGANIZATION: 2,
  BRANCH: 3,
};

/* Add key in firebaseCollectionsKey */
export const firebaseCollections = {
  USER: 'user',
  USER_SESSIONS: 'user_sessions',
  SALE: 'sale',
  SALE_DETAIL: 'sale_detail',
  INVETORY_BRANCH: 'inventory_branch',
  INVENTORY: 'inventory',
  TRACKING_INVENTORY: 'tracking_inventory',
  EMPLOYEE: 'employee',
  PRODUCT_INVENTORY: 'product_inventory',
  PRODUCT: 'product',
};

export const firebaseCollectionsKey = {
  user: 'id_user',
  sale: 'id_sale',
  inventory_branch: 'id_inventory_branch',
  inventory: 'id_inventory',
  user_sessions: 'id_user_session',
};

export const alertType = {
  SUCCESS: 'success',
  ERROR: 'error',
};
