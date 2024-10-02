import { Button } from '@mui/material';
import React from 'react';
import Can from './permissions/Can';

const ApsButton = ({ can = null, children, ...props }) => {
  return can ? (
    <Can {...can}>
      <Button {...props}>{children}</Button>
    </Can>
  ) : (
    <Button {...props}>{children}</Button>
  );
};

export default React.memo(ApsButton);
