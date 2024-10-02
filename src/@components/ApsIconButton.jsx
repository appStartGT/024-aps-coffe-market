import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import Can from './permissions/Can';

const ApsButton = ({
  can = null,
  tooltip = null,
  loading = false,
  children,
  ...props
}) => {
  const button = (
    <IconButton size="small" {...props} disabled={loading || props.disabled}>
      {loading ? <CircularProgress size={24} /> : children}
    </IconButton>
  );

  const buttonWithTooltip = tooltip ? (
    <Tooltip {...tooltip}>{button}</Tooltip>
  ) : (
    button
  );

  return can ? <Can {...can}>{buttonWithTooltip}</Can> : buttonWithTooltip;
};

export default React.memo(ApsButton);
