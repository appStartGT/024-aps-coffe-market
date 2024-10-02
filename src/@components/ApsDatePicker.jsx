import { Fragment } from 'react';
import { Grid, TextField } from '@mui/material';

const ApsDatePicker = ({ gridItem = false, gridProps = {}, ...props }) => {
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

  const _changeValue = (e, v) =>
    props.onChange ? props.onChange(v) : undefined;

  const _formikConfig = () => {
    const { name, formik } = props;
    if (!formik || !name) return {};
    return {
      value: formik.values[name],
      onChange: (value) => {
        formik.setFieldValue(name, value.target.value);
      },
      error: /* formik.touched[name] && */ Boolean(formik.errors[name]),
      helperText: /* formik.touched[name] &&  */ formik.errors[name],
    };
  };

  return (
    <Container {...propsGrid}>
      <TextField
        InputLabelProps={{ shrink: true }}
        fullWidth
        type="date"
        {...props}
        onChange={_changeValue}
        {..._formikConfig()}
        inputProps={{
          autoComplete: 'new-password',
          form: {
            autocomplete: 'off',
          },
        }}
      />
    </Container>
  );
};

export default ApsDatePicker;
