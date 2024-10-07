const constantColors = {
  error: {
    main: '#FD4E49',
  },
  info: {
    main: '#3DA9FC',
  },
  warning: {
    main: '#FF7C02',
  },
  success: {
    main: '#2B9D4B',
  },
  disabled: {
    main: '#bababa',
  },
  blackLight: {
    main: 'rgba(0, 0, 0, 0.6)',
  },
};

const chartColors = {
  totalPurchases: {
    background: '#e3f2fd',
    text: '#1565c0',
  },
  totalQuantity: {
    background: '#e8f5e9',
    text: '#2e7d32',
  },
  averagePrice: {
    background: '#fff3e0',
    text: '#e65100',
  },
  totalAmount: {
    background: '#fce4ec',
    text: '#c2185b',
  },
  totalAdvancePayments: {
    background: '#e8f5e9',
    text: '#2e7d32',
  },
  advancePayment: {
    background: '#e8f5e9',
    text: '#2e7d32',
  },
  balance: {
    background: '#e0f2f1',
    text: '#00695c',
  },
};

//paletas
export const defaultPalette = {
  mode: 'light',
  primary: {
    main: '#4A7C59', // Green from the fields
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#D2B48C', // Tan
    contrastText: '#FFFFFF',
  },
  text: {
    title: '#1A1A1A', // Dark color for text
    subtitle: '#6B7280',
  },
  icon: {
    main: '#6B7280',
    error: '#DB2828',
  },
  background: {
    default: '#EBEBEB', // Sky blue
  },
  sidebar: {
    title: '#1A1A1A',
    subtitle: '#6B7280',
    background: '#D3D3D3', // Slightly darker than background
    itemSelected: '#4A7C59', // Green from the fields
    textItemSelected: '#ffffff',
    iconItemSelected: '#ffffff',
  },
  toolbar: {
    background: '#F6F7F9',
  },
  paper: {
    background: '#FFFFFF',
  },
  appbar: { background: '#EBEBEB' }, // Brown variation to match with green
  ...constantColors,
  ...chartColors,
};
