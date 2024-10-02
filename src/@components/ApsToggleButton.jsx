import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

/* Example */
/*   const buttons = [
    {
      name: 'en',
      onClick: () => console.log('object'),
    },
    {
      name: 'es',
      onClick: () => console.log('object'),
    },
  ]; */

const ApsToggleButton = ({
  buttons = [],
  ToggleButtonGroupProps = {},
  ToggleButtonProps = {},
  value,
  onChange,
}) => {
  const handleChange = (event, selection) => {
    onChange && onChange(selection);
  };

  return (
    <ToggleButtonGroup
      color="secondary"
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      fullWidth
      size="small"
      {...ToggleButtonGroupProps}
    >
      {buttons.map((btn, index) => (
        <ToggleButton
          key={`ToggleButton-${index}`}
          fullWidth
          value={btn.name}
          {...ToggleButtonProps}
        >
          {btn.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ApsToggleButton;
