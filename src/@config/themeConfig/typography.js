import createBreakpoints from '@mui/system/createTheme/createBreakpoints';

const breakpoints = createBreakpoints({
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1440,
  },
});

export const typography = () => ({
  fontFamily: 'Roboto, sans-serif',
  h1: {
    fontWeight: 900,
    fontSize: '1.9rem',
    fontStyle: 'normal',
    [breakpoints.up('sm')]: {
      fontSize: '2.15rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2.65rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '2.65rem',
    },
  },
  h2: {
    fontWeight: 700,
    fontSize: '1.65rem',
    letterSpacing: '-0.5px',
    [breakpoints.up('sm')]: {
      fontSize: '1.9rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '2.4rem',
    },
  },
  h3: {
    fontWeight: 700,
    fontSize: '1.4rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.65rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2.15rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '2.15rem',
    },
  },
  h4: {
    fontWeight: 700,
    fontSize: '1.15rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.4rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '1.9rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '1.9rem',
    },
  },
  h5: {
    fontWeight: 700,
    fontSize: '1rem',
    [breakpoints.up('sm')]: {
      fontSize: '1.15rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '1.65rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '1.65rem',
    },
  },
  h6: {
    fontWeight: 700,
    fontSize: '0.9rem',
    textTransform: 'none',
    [breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '1.4rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '1.4rem',
    },
  },
  subtitle1: {
    fontWeight: 'normal',
    fontSize: '0.8rem',
    [breakpoints.up('sm')]: {
      fontSize: '0.9rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '1.15rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '1.15rem',
    },
  },
  subtitle2: {
    fontWeight: 400,
    fontSize: '0.7rem',
    letterSpacing: '0.1px',
    [breakpoints.up('sm')]: {
      fontSize: '0.75rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '0.9rem',
    },
  },
  body1: {
    fontWeight: 400,
    fontSize: '0.8rem',
    [breakpoints.up('sm')]: {
      fontSize: '0.9rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '1.1rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '1.1rem',
    },
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.7rem',
    [breakpoints.up('sm')]: {
      fontSize: '0.75rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '0.9rem',
    },
  },
  button: {
    fontWeight: 500,
    fontSize: '0.7rem',
    letterSpacing: '0.02em',
    [breakpoints.up('sm')]: {
      fontSize: '0.75rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '0.9rem',
    },
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.6rem',
    lineHeight: 1.66,
    [breakpoints.up('sm')]: {
      fontSize: '0.65rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '0.8rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '0.8rem',
    },
  },
  overline: {
    fontWeight: 400,
    fontSize: '0.5rem',
    letterSpacing: '0.08em',
    lineHeight: 2.66,
    textTransform: 'uppercase',
    [breakpoints.up('sm')]: {
      fontSize: '0.55rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '0.7rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '0.7rem',
    },
  },
});
