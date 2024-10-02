import { Fragment } from 'react';
import { Grid } from '@mui/material';

const ApsCustomField = ({ children, gridItem = false, gridProps = {} }) => {
  const Container = gridItem ? Grid : Fragment;
  const propsGrid = gridItem
    ? {
        item: true,
        md: 6,
        sm: 12,
        xs: 12,
        ...gridProps,
      }
    : {};

  return <Container {...propsGrid}>{children}</Container>;
};

export default ApsCustomField;
