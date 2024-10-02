import * as palettes from './palettes';
import { typography } from './typography';
import { overrideComponents } from './overrides';
import { useSelector } from 'react-redux';

const useConfigTheme = () => {
  const palette = useSelector((state) => state.theme.palette);
  const selectedPalette = palettes[palette] || palettes.defaultPalette;

  const configTheme = {
    default: {
      palette: selectedPalette,
      // palette: {mode:'dark'},//dark theme
      typography: typography(selectedPalette),
      // shadows:[],
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1440,
          special: 3166,
        },
      },
      components: overrideComponents(selectedPalette),
    },
  };

  return { theme: configTheme.default };
};

export default useConfigTheme;
