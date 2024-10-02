import moment from 'moment';

export const listHospitalario = (data) => {
  return data.map((item) => {
    return {
      ...parseHospitalario(item),
    };
  });
};

export const parseHospitalario = (ho) => {
  return {
    id: ho.id_services_record,
    description: ho.description || '',
    client: `${ho.client.person?.names} ${ho.client.person?.surNames}`,
    names: ho.client.person?.names,
    surNames: ho.client.person?.surNames,
    address: ho.client.person?.address || '',
    createdAt: ho.createdAt
      ? moment.utc(ho.createdAt).format('DD/MM/YYYY')
      : '',
    id_status: ho.servicesRecordStatutes[0]?.status.id_status,
    status: ho.servicesRecordStatutes[0]?.status.name.toUpperCase(),
    total: ho.total || 0,
    laboratoryFeesTotal: ho?.servicesCharges?.length,
    serviceTypeName: ho?.serviceType
      ? ho?.serviceType.name
      : 'Servicio no ingresado',
    id_gender: ho?.client?.person?.id_gender || '',
  };
};

export const parseHospitalarioGetOne = (ho) => {
  return {
    id: ho.id_services_record,
    description: ho.description || '',
    names: ho.client.person?.names,
    surNames: ho.client.person?.surNames,
    address: ho.client.person?.address || '',
    DPI: ho.client.person?.DPI || '',
    NIT: ho.client.person?.NIT || '',
    phone: ho.client.person?.phone || '',
    dateOfBirth: ho.client.person?.dateOfBirth
      ? moment.utc(ho.client.person?.dateOfBirth).format('YYYY-MM-DD')
      : '',
    id_status: ho.servicesRecordStatutes[0]?.status.id_status || '',
    status: ho.servicesRecordStatutes[0]?.status.name.toUpperCase(),
    id_service_type: ho?.id_service_type || '',
    serviceTypeName: ho?.serviceType
      ? ho?.serviceType.name
      : 'Servicio no ingresado',
    clientNotes: ho.client.clientNotes.map((conditionNotes) => ({
      value: conditionNotes.id_condition_notes,
      label: conditionNotes.conditionNotes.name,
    })),
    resident_employee: ho?.resident_employee || '',
    treating_employee: ho?.treating_employee || '',
    total: ho?.total || 0,
    id_gender: ho?.client?.person?.id_gender || '',
  };
};

export const parseHospitalarioGetOneAllDetalle = (ho) => {
  return {
    id: ho.id_services_record,
    client: `${ho.client.person?.names} ${ho.client.person?.surNames}`,
    description: ho.description || 'No ingresado',
    address: ho.client.person?.address || 'No ingresado',
    DPI: ho.client.person?.DPI || 'No ingresado',
    NIT: ho.client.person?.NIT || 'No ingresado',
    phone: ho.client.person?.phone || 'No ingresado',
    createdAt: ho.createdAt
      ? moment.utc(ho.createdAt).format('DD-MM-YYYY')
      : 'No ingresado',
    dateOfBirth: ho.client.person?.dateOfBirth
      ? moment.utc(ho.client.person?.dateOfBirth).format('DD-MM-YYYY')
      : 'No ingresado',
    serviceTypeName: ho?.serviceType
      ? ho?.serviceType.name
      : 'Servicio no ingresado',
    clientNotes: ho.client.clientNotes.map((conditionNotes) => ({
      value: conditionNotes.id_condition_notes,
      label: conditionNotes.conditionNotes.name,
    })),
    hospitalario: ho?.servicesFees.map((hospitalizacion) => ({
      name: hospitalizacion?.description || 'Sin descripción',
      subtotal: hospitalizacion?.amount,
    })),
    laboratorio: ho?.servicesCharges.map((laboratorio) => ({
      name: laboratorio?.description || 'Sin descripción',
      subtotal: laboratorio?.amount,
    })),
    honorarios: ho?.transactionFees.map((medic) => ({
      name: medic?.description || 'Sin descripción',
      subtotal: medic?.amount,
    })),
    products: ho?.pharmacySales?.[0]?.saleDetail?.map((producto) => ({
      name: `${producto.product?.generic_name} (${producto.product?.trade_name}) P.U. Q${producto?.sale_price} X ${producto?.quantity}`,
      subtotal: +producto?.sale_price * +producto?.quantity,
      deleted: producto.product.deleted,
    })),
    total: ho?.total || 0,
    id_gender: ho?.client?.person?.id_gender || '',
  };
};

export const parseHospitalarioPutCreate = (ho) => {
  return {
    ...ho,
    clientNotes: ho?.clientNotes?.map((conditionNotes) => conditionNotes.value),
  };
};

export const updateListHospitalario = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_services_record) {
      return parseHospitalario({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
