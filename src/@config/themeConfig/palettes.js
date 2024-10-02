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

//paletas
export const defaultPalette = {
  mode: 'light',
  primary: {
    main: '#7F889B',
    contrastText: '#FFFFFF',
  },
  text: {
    title: '#101827',
    subtitle: '#6B7280',
  },
  icon: {
    main: '#6B7280',
    error: '#DB2828',
  },
  background: {
    default: '#F1F1F1',
  },
  sidebar: {
    title: '#101827',
    subtitle: '#6B7280',
    background: '#EBEBEB',
    itemSelected: '#7F889B',
    textItemSelected: '#ffffff',
    iconItemSelected: '#ffffff',
  },
  toolbar: {
    background: '#F6F7F9',
  },
  paper: {
    background: '#FFFFFF',
  },
  appbar: { background: '#1A1A1A' },
  ...constantColors,
};

/* export const bluePalette = {
  type: 'light',
  button: {
    background: '#3C88FF',
    text: '#FFFFFF',
  },
  text: {
    title: '#094067',
    subtitle: '#4A7C9F',
  },
  background: {
    default: '#F3F5F9',
  },
  sidebar: {
    background: '#094067',
    text: '#FFFFFF',
    subtitle: '#D9D9D9',
  },
  toolbar: {
    background: '#F3F5F9',
  },
  paper: {
    background: '#FFFFFF',
  },
  ...constantColors,
};
 */
