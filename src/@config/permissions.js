export const Actions = {
  //the action name can also be the route name
  RESET_PASSWORD: 'Reset password', // this is used as a reference don't include it in the DB
  MAIN: 'Main', // this is used as a reference don't include it in the DB

  /* ------------------------------------------------------------------------- */
  /* --------- this are all the unique actions registered in the DB ---------- */
  /* ------------------------------------------------------------------------- */

  //MENU ACTIONS
  MENU_VENTAS: 'Ventas',
  MENU_ADMINISTRADOR: 'Administrador',
  MENU_PRODUCTO: 'Producto',
  MENU_ORGANIZATION: 'Organización',
  MENU_ORGANIZATIONS: 'Organizaciones',
  MENU_EMPLOYEES: 'Nomina',

  ADMINSTRADOR_TAB_USUARIOS: 'Tab usuarios',
  ADMINSTRADOR_TAB_ROLES: 'Tab roles',
  ADMINSTRADOR_TAB_PERSONALEXT: 'Tab personal externo',
  ADMINSTRADOR_TAB_ROLES_PERMISOS: 'Tab permisos',

  VENTAS_TAB_STORE: 'Tab_tienda',

  ORGANIZATION_TAB_DETALLES: 'Tab_detalles',
  ORGANIZATION_TAB_USERS: 'Tab_usuarios',
  ORGANIZATION_TAB_BRANCHES: 'Tab_sucursales',
  BRANCH_TAB_DETALLES: 'Tab_detalles',
  BRANCH_TAB_USERS: 'Tab_usuarios',

  EMPLOYEES_TAB_DETALLES: 'Tab_detalles',
  EMPLOYEES_TAB_PAGOS: 'Tab_pagos',

  // CRUD SHARED ACTIONS
  CREATE: 'Crear',
  EDIT: 'Editar',
  DELETE: 'Eliminar',
  SAVE: 'Guardar',
  PREVIEW: 'Vista previa',
  LIST_ALL: 'Listar todos',
  GENERAR_REPORTE: 'Generar reporte',
  DISABLE_BREADCRUMB: 'Ocultar breadcrumb',
};

export const Subjects = {
  MAIN_NAVIGATION: 'Side menu',
  ADMINISTRADOR: 'Administrador',
  ADMINISTRADOR_TAB_USUARIOS: 'Administrador (Tab usuarios)',
  ADMINISTRADOR_TAB_PERSONALEXT: 'Administrador (Tab personal externo)',
  ADMINISTRADOR_TAB_ROLES: 'Administrador (Tab roles)',
  PRODUCTO: 'Producto',
  VENTAS: 'Ventas',
  VENTAS_TAB_STORE: 'Ventas (Tab_tienda)',

  ORGANIZATION: 'Organización',
  ORGANIZATIONS: 'Organizaciones',

  ORGANIZATION_TAB_DETALLES: 'Organización (Tab_detalles)',
  ORGANIZATIONS_TAB_DETALLES: 'Organizaciones (Tab_detalles)',
  ORGANIZATION_TAB_USERS: 'Organización (Tab_usuarios)',
  ORGANIZATIONS_TAB_USERS: 'Organizaciones (Tab_usuarios)',
  ORGANIZATION_TAB_BRANCHES: 'Organización (Tab_sucursales)',
  ORGANIZATIONS_TAB_BRANCHES: 'Organizaciones (Tab_sucursales)',
  BRANCH: 'Sucursal',
  BRANCH_TAB_USERS: 'Sucursal (Tab_usuarios)',
  BRANCH_TAB_DETALLES: 'Sucursal (Tab_detalles)',
  EMPLOYEES: 'Nomina',
  EMPLOYEES_TAB_DETALLES: 'Nomina (Tab_detalles)',
  EMPLOYEES_TAB_PAGOS: 'Nomina (Tab_pagos)',
};
