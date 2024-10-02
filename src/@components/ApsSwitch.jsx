import { Fragment } from 'react';
import { FormControlLabel, Grid, Switch, Tooltip } from '@mui/material';

const ApsSwitch = ({
  gridItem = false,
  gridProps = {},
  tooltipOne = '',
  tooltipTwo = '',
  color = 'primary',
  labelProps = {},
  ...props
}) => {
  const _changeValue = (e) =>
    props.onChange ? props.onChange(e.target.value) : undefined;
  const _formikConfig = () => {
    const { name, formik } = props;
    if (!formik || !name) return {};

    return {
      value: formik.values[name],
      checked: formik.values[name],
      onChange: formik.handleChange,
    };
  };

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

  const SwitchComponent = () => (
    <Tooltip title={_formikConfig().checked ? tooltipOne : tooltipTwo}>
      <Switch
        color={color}
        {...props}
        onChange={_changeValue}
        {..._formikConfig()}
      />
    </Tooltip>
  );

  return (
    <Container {...propsGrid}>
      {props.label ? (
        <FormControlLabel
          control={<SwitchComponent />}
          {...labelProps}
          label={props.label}
        />
      ) : (
        <SwitchComponent />
      )}
    </Container>
  );
};

export default ApsSwitch;
