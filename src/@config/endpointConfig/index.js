const API_URL = import.meta.env.REACT_APP_API_URL;

export const authUrl = {
  login: `${API_URL}/auth/login`,
  validateToken: `${API_URL}/auth/validate-token`,
  newAccessToken: `${API_URL}/auth/request-new-access-token`,
  permissions: `${API_URL}/auth/permissions`,
  resetPassword: `${API_URL}/auth/reset-password`,
  recoveryPassword: `${API_URL}/auth/recovery-password`,
};

export const roleUrl = {
  create: `${API_URL}/role`,
  list: `${API_URL}/role`,
  getOne: (id) => `${API_URL}/role/${id}`,
  put: `${API_URL}/role`,
  delete: (id_role) => `${API_URL}/role/${id_role}`,
};

export const userUrl = {
  create: `${API_URL}/user`,
  update: `${API_URL}/user`,
  list: `${API_URL}/user`,
  getOne: (id_user) => `${API_URL}/user/${id_user}`,
  delete: (id_user) => `${API_URL}/user/${id_user}`,
  theme: `${API_URL}/user/theme`,
};

export const subjectlUrl = {
  list: `${API_URL}/subject`,
};

export const permissionlUrl = {
  list: `${API_URL}/permission`,
  updateOrCreate: `${API_URL}/permission`,
};

export const catalogUrl = {
  serviceType: `${API_URL}/catalog/service-type`,
  personType: `${API_URL}/catalog/person-type`,
  conditionNotes: `${API_URL}/catalog/conditionNotes`,
  provider: `${API_URL}/catalog/provider`,
  statusRecord: `${API_URL}/catalog/status`,
  person: `${API_URL}/person/search`,
  gender: `${API_URL}/catalog/gender`,
  productMeasureType: `${API_URL}/catalog/productMeasureType`,
  category: `${API_URL}/catalog/category`,
  createProvider: `${API_URL}/catalog/provider`,
  createCategory: `${API_URL}/catalog/category`,
  createProductMeasureType: `${API_URL}/catalog/productMeasureType`,
};

export const configurationUrl = {
  campus: `${API_URL}/configuration/campus`,
  campusGradeGet: `${API_URL}/configuration/campusGrade/all`,
  campusGrade: `${API_URL}/configuration/campusGrade`,
  campusGradeActivate: `${API_URL}/configuration/campusGrade/activate`,
};

export const hospitlarioUrl = {
  list: `${API_URL}/services-record`,
  create: `${API_URL}/services-record`,
  put: `${API_URL}/services-record`,
  getOne: (id_services_record) =>
    `${API_URL}/services-record/${id_services_record}`,
  delete: (id_services_record) =>
    `${API_URL}/services-record/${id_services_record}`,
  clone: (id_services_record) =>
    `${API_URL}/services-record/clone/${id_services_record}`,
};

export const tabHonorarioUrl = {
  list: `${API_URL}/transaction-fee`,
  create: `${API_URL}/transaction-fee`,
  put: `${API_URL}/transaction-fee`,
  delete: (id_transaction_fee) =>
    `${API_URL}/transaction-fee/${id_transaction_fee}`,
};

export const tabMedicamentoUrl = {
  list: `${API_URL}/sale`,
  create: `${API_URL}/sale`,
  create_detail: `${API_URL}/sale-detail`,
  put: `${API_URL}/sale`,
  delete: (id_sale) => `${API_URL}/sale/${id_sale}`,
};

export const tabHospitalizacionUrl = {
  list: `${API_URL}/services-fee`,
  create: `${API_URL}/services-fee`,
  put: `${API_URL}/services-fee`,
  delete: (id_services_fee) => `${API_URL}/services-fee/${id_services_fee}`,
};

export const tabLaboratorioUrl = {
  list: `${API_URL}/service-change`,
  create: `${API_URL}/service-change`,
  put: `${API_URL}/service-change`,
  delete: (id_service_charge) =>
    `${API_URL}/service-change/${id_service_charge}`,
};

export const tabProductosFarmaciaUrl = {
  list: `${API_URL}/product`,
  create: `${API_URL}/product`,
  put: `${API_URL}/product`,
  delete: (id_product) => `${API_URL}/product/${id_product}`,
};

export const tabStockUrl = {
  list: `${API_URL}/stock`,
  create: `${API_URL}/stock`,
  put: `${API_URL}/stock`,
  delete: (id_stock) => `${API_URL}/stock/${id_stock}`,
};

export const tabStoreSalesUrl = {
  list_inventario: `${API_URL}/stock/search`,
  list: `${API_URL}/sale`,
  create: `${API_URL}/sale`,
  clone: (id_sale) => `${API_URL}/sale/clone/${id_sale}`,
  put: `${API_URL}/sale`,
  delete: (id_sale) => `${API_URL}/sale/${id_sale}`,
  findNit: `${API_URL}/sale/find-sale/nit`,
};

export const personUrl = {
  list: `${API_URL}/person`,
  create: `${API_URL}/person`,
  put: `${API_URL}/person`,
  delete: (id_person) => `${API_URL}/person/${id_person}`,
};

export const organizationUrl = {
  list: `${API_URL}/organization`,
  create: `${API_URL}/organization`,
  put: `${API_URL}/organization`,
  getOne: (id_organization) => `${API_URL}/organization/${id_organization}`,
  delete: (id_organization) => `${API_URL}/organization/${id_organization}`,
};

export const branchUrl = {
  list: `${API_URL}/branch`,
  create: `${API_URL}/branch`,
  put: `${API_URL}/branch`,
  getOne: (id_branch) => `${API_URL}/branch/${id_branch}`,
  delete: (id_branch) => `${API_URL}/branch/${id_branch}`,
};
