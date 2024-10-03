import { statusHospitalRecord } from './constants';
import axios from 'axios';

// GENERIC FUNCTIONS
export function generateBreadcrumb(_route) {
  //obtains all the modules removing main and empty if it exists
  let modules = _route.split('/').filter((r) => r !== 'main' && r !== '');

  //takes out the last item of the route
  let index = modules.length - 1;
  //it reads if it's a number so it can take out the one before too
  if (modules[index].match(/^\d+$/)) {
    modules.pop();
    index--;
    //if it has more than one parameter as number, it takes them all
    while (!isNaN(modules[index])) {
      modules.pop();
      index--;
    }
    //lastly it takes out the last module
    modules.pop();
  } else {
    modules.pop();
  }

  let finalBreadcrumbs = [];
  let _linkIds = '';
  let _link = '';

  for (let i = modules.length - 1; i >= 0; i--) {
    const _module = modules[i];
    if (i == 0) {
      finalBreadcrumbs.unshift({
        description: `${firstLetterCap(_module)}`,
        link: `/main/${_module}`,
      });
    } else if (!isNaN(_module)) {
      _linkIds = `/${_module}` + _linkIds;
    } else {
      for (let j = 0; j <= i; j++) {
        if (j == 0) {
          _link = `/main/${modules[j]}`;
        } else {
          _link += `/${modules[j]}`;
        }
      }
      finalBreadcrumbs.unshift({
        description: `${firstLetterCap(_module)}`,
        link: `${_link}${_linkIds}`,
      });
      _linkIds = '';
      _link = '';
    }
  }
  return finalBreadcrumbs;
}

export function firstLetterCap(_text) {
  const words = _text.split('-');
  let response = '';

  for (let i = 0; i < words.length; i++) {
    const firstLetter = words[i].slice(0, 1);
    const afterFirstLetter = words[i].slice(1);
    if (i == 0) {
      response = firstLetter.toUpperCase() + afterFirstLetter.toLowerCase();
    } else {
      response =
        response +
        ' ' +
        firstLetter.toUpperCase() +
        afterFirstLetter.toLowerCase();
    }
  }
  return response;
}

export function firstSentenceLetterCap(_text) {
  const firstLetter = _text.slice(0, 1);
  const afterFirstLetter = _text.slice(1);
  return firstLetter.toUpperCase() + afterFirstLetter.toLowerCase();
}

export function formatSnackBarData(data) {
  let finalObject = {
    autoHideDuration: 6000,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    },
  };
  //SUCCESFUL REQUEST
  if (data.message) {
    finalObject.message = data.message;
    if (data.severity) {
      finalObject.severity = data.severity;
    } else {
      finalObject.severity = 'success';
    }
    //CONTROLED ERROR
  } else if (data?.payload?.payload?.data?.status == 400) {
    finalObject.message = data.payload.payload.data.message;
    finalObject.severity = 'error';
    //PARAMS ERROR
  } else if (data?.payload?.payload?.data?.status == 411) {
    const realData = data.payload.payload.data;
    finalObject.message = realData.message + ' ' + realData.stack;
    finalObject.severity = 'error';
  } else {
    finalObject = {
      ...finalObject,
      ...data,
    };
  }
  return { payload: finalObject };
}

export const convertToFormData = (object = {}) => {
  const formData = new FormData();
  // Append the data as form data
  Object.keys(object).forEach((field) => {
    if (Array.isArray(object[field])) {
      formData.append(`${field}[]`, object[field]);
    } else if (object[field] instanceof File) {
      formData.append(field, object[field]);
    } else if (
      !(object[field] instanceof File) &&
      typeof object[field] === 'object' &&
      object[field] !== null
    ) {
      formData.append(field, JSON.stringify(object[field]));
    } else {
      formData.append(field, object[field]);
    }
  });

  return formData;
};

export const cleanModel = (
  model = {},
  config = { allowNulls: false, allowEmptyStrings: false }
) => {
  return Object.keys(model).reduce((acc, key) => {
    if (
      (model[key] != undefined &&
        (model[key] != null || (model[key] == null && config.allowNulls)) &&
        (model[key] != '' || (model[key] == '' && config.allowEmptyStrings))) ||
      typeof model[key] == 'boolean' ||
      typeof model[key] == 'number'
    ) {
      Object.assign(acc, { [key]: model[key] });
    }
    return acc;
  }, {});
};

export const validateBoolean = (value) =>
  typeof value === 'boolean' ? value : value == 'true' ? true : false;

// export const getFIleFromURL = async () =>
//   new Promise((resolve, reject) =>
//     fetch('https://storage.googleapis.com/dev_charter/1682011718116.pdf', {
//       method: 'GET',
//     })
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'file.pdf';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//         resolve(true);
//       })
//       .catch((error) => {
//         console.error(error);
//         reject(error);
//       })
//   );

export const getFIleFromURL = async () => {
  try {
    const response = await axios.get(
      'https://storage.googleapis.com/dev_charter/1682011718116.pdf',
      {
        responseType: 'blob',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/pdf',
        },
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const truncarNombreArchivo = (nombreArchivo, longitudMaxima = 15) => {
  if (nombreArchivo.length <= longitudMaxima) {
    return nombreArchivo;
  } else {
    const nombreSinExtension = nombreArchivo.slice(
      0,
      nombreArchivo.lastIndexOf('.')
    );
    const nombreCorto = nombreSinExtension.slice(0, longitudMaxima) + '...';
    return nombreCorto;
  }
};

export const getStockStatusColor = (stock, theme) => {
  if (stock >= 0 && stock <= 10) {
    return theme.palette.error.main;
  } else if (stock >= 11 && stock <= 20) {
    return theme.palette.warning.main;
  } else {
    return theme.palette.success.main;
  }
};

export const getStatusColorHospitalRecord = (id, theme) => {
  if (id == statusHospitalRecord.INGRESADO) {
    return { backgroundColor: theme.palette.disabled.main, color: 'black' };
  }
  if (id == statusHospitalRecord.POR_PAGAR) {
    return { backgroundColor: theme.palette.warning.main, color: 'white' };
  }
  if (id == statusHospitalRecord.PAGADO) {
    return { backgroundColor: theme.palette.success.main, color: 'white' };
  }
};

// export const formatFirebaseDate = (firebaseTimestamp) => {
//   const date = new Date(
//     firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000
//   );
//   return moment(date).format('DD/MM/YYYY');
// };

export const firebaseFilterBuilder = (params) =>
  Object.keys(params).reduce((acc, key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      acc.push({
        field: key,
        condition: '==',
        value: value,
      });
    }
    return acc;
  }, []);
