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
  PURCHASE: 'purchase',
  CUSTOMER: 'customer',
  PURCHASE_DETAIL: 'purchase_detail',
  ROLE: 'role',
  PERSON_TYPE: 'person_type',
  CAT_PAYMENT_METHOD: 'cat_payment_method',
  CAT_EXPENSE_TYPE: 'cat_expense_type',
  PERSON: 'person',
  BUDGET: 'budget',
  BUDGET_ITEM: 'budget_item',
  EXPENSE: 'expense',
};

export const firebaseCollectionsKey = {
  user: 'id_user',
  sale: 'id_sale',
  role: 'id_role',
  inventory_branch: 'id_inventory_branch',
  inventory: 'id_inventory',
  user_sessions: 'id_user_session',
  purchase: 'id_purchase',
  customer: 'id_customer',
  purchase_detail: 'id_purchase_detail',
  person_type: 'id_person_type',
  cat_payment_method: 'id_cat_payment_method',
  person: 'id_person',
  budget: 'id_budget',
  budget_item: 'id_budget_item',
  expense: 'id_expense',
  cat_expense_type: 'id_cat_expense_type',
};

export const alertType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export const paymentMethodType = {
  CASH: 'U4za5UqRxnDdgCdG32nL',
};
