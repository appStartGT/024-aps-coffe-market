import * as yup from 'yup';
import moment from 'moment';

export const MESSAGES = {
  REQUIRED_FIELD: 'Requerido',
};

/* Custom validations */
function requiredSelectMethod(message) {
  return this.test('requiredSelect', message, function (value) {
    const { path, createError } = this;
    const fieldValue = typeof value === 'object' ? value?.value : value;

    if (!value) {
      return createError({
        path,
        message: message ?? MESSAGES.REQUIRED_FIELD,
      });
    }

    if (fieldValue == -1) {
      return createError({
        path,
        message: message ?? MESSAGES.REQUIRED_FIELD,
      });
    }

    return true;
  });
}
yup.addMethod(yup.mixed, 'requiredSelect', requiredSelectMethod);

/* Custom validations */
function validateDateMethod({ message, min, max, required }) {
  return this.test('dateValidation', message, function (value) {
    const { path, createError } = this;

    if (!value && required) {
      return createError({
        path,
        message: message ?? MESSAGES.REQUIRED_FIELD,
      });
    }

    if (value === 'Invalid date') {
      return createError({
        path,
        message: 'Invalid date',
      });
    }
    if (min && max && value) {
      const fechaMinima = moment(min);
      const fechaMaxima = moment(max);
      const fechaSeleccionada = moment(value);

      if (
        !fechaSeleccionada.isSameOrAfter(fechaMinima) ||
        !fechaSeleccionada.isSameOrBefore(fechaMaxima)
      ) {
        return createError({
          path,
          message: 'La fecha seleccionada está fuera de rango.',
        });
      }
    }
    return true;
  });
}
yup.addMethod(yup.mixed, 'dateValidation', validateDateMethod);

export const fieldValidations = {
  required: yup.string().required(MESSAGES.REQUIRED_FIELD),
  requiredCustom: (msg) => yup.string().required(msg),
  numberInger: ({ required } = {}) =>
    yup
      .number()
      .typeError('Debe ser un número')
      .integer('Debe ser un entero')
      .required(required ? MESSAGES.REQUIRED_FIELD : null),
  requiredSelect: yup.mixed().requiredSelect(),
  dateValidation: ({ message, min, max, required }) =>
    yup.mixed().dateValidation({ message, min, max, required }),
  telephoneRequired: yup
    .string()
    .matches(/^\+?\d{1,3}[-.\s]?\d{1,14}$/, 'Ingresa un teléfono válido.')
    .required('El teléfono es requerido.'),
  telephone: yup
    .string()
    .matches(/^\+?\d{1,3}[-.\s]?\d{1,14}$/, 'Ingresa un teléfono válido.'),
  email: yup.string().email('Enter a valid email.'),
  emailRequired: yup
    .string()
    .email('Ingresa un correo electrónico válido.')
    .required('El correo electrónico es requerido.'),
  description: yup
    // .string('Enter your description')
    // .min(10, 'Description is too short'),
    .string('Ingresa la descripción.')
    .min(3, 'La descripción es demasiado corta.'),
  descriptionRequired: yup
    .string('Enter your description')
    .min(10, 'Description is too short')
    .required('Description is required'),
  number: yup
    .number('Field only accepts numbers.')
    .min(0, 'Amount has to be 0 or greater.'),
  numberRequired: yup
    .number('Field only accepts numbers.')
    .min(0, 'Amount has to be 0 or greater.')
    .required('Quantity is required.'),
  numberSpotsFields: yup
    .number('Field only accepts numbers.')
    .typeError('Field only accepts numbers.')
    .min(0, 'Amount has to be 0 or greater.')
    .required('The amount must be equal to or greater than zero.'),
  password: yup
    .string('Ingrese su contraseña.')
    .min(8, 'Debe tener al menos 8 caracteres.')
    .required(MESSAGES.REQUIRED_FIELD),
  dpiEmail: yup
    .string()
    .required(MESSAGES.REQUIRED_FIELD)
    .test('valid-input', 'Ingrese un email válido.', function (value) {
      // Validate if it's a valid email or DPI
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // email validation
      const dpiRegex = /^\d{13}$/; // 13 digits for DPI

      if (emailRegex.test(value) || dpiRegex.test(value)) {
        return true;
      }

      return false;
    }),
};

export default fieldValidations;
