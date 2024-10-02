import React, { useCallback } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import ApsAutoComplete from './ApsAutoComplete';
import ApsTextField from './ApsTextField';
import { Fragment } from 'react';
import ApsCustomField from './ApsCustomField';
import ApsDatePicker from './ApsDatePicker';
import ApsSwitch from './ApsSwitch';

const ApsForm = ({
  title,
  titleProps = {},
  paper,
  paperProps,
  formik,
  handleSubmit,
}) => {
  const FormWrapper = paper ? Paper : Fragment;
  const formWrapperProps = paper
    ? { sx: { padding: '20px', borderRadius: '16px' }, ...paperProps }
    : {};

  const keyDowEvent = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  });

  const renderFieldType = (form, field) => {
    /* Add enter submit event */
    if (typeof handleSubmit === 'function') {
      field.onKeyDown = keyDowEvent;
    }
    if (field.renderfunction) {
      delete field.renderfunction;
    }

    switch (field.field) {
      case 'autocomplete':
        return <ApsAutoComplete formik={form} key={field.id} {...field} />;

      case 'select':
        return (
          <ApsTextField formik={form} key={field.id} select={true} {...field} />
        );
      case 'datePicker':
        return <ApsDatePicker formik={form} key={field.id} {...field} />;
      case 'switch':
        return <ApsSwitch formik={form} key={field.id} {...field} />;
      case 'custom':
        return (
          <ApsCustomField
            key={field.id}
            children={field?.children}
            gridItem={field?.gridItem}
            gridProps={field?.gridProps}
          />
        );

      default:
        return <ApsTextField formik={form} key={field.id} {...field} />;
    }
  };

  return (
    <>
      {title && (
        <Typography
          variant="h5"
          children={title}
          color="primary"
          sx={{ marginBottom: '24px' }}
          {...titleProps}
        />
      )}
      <FormWrapper {...formWrapperProps}>
        <Grid container spacing={3} component="form" autoComplete="off">
          {formik?.fields?.map((field) => {
            return field.renderfunction ? (
              field.renderfunction() ? (
                renderFieldType(formik.form, field)
              ) : (
                <Fragment key={field.id} />
              )
            ) : (
              renderFieldType(formik.form, field)
            );
          })}
        </Grid>
      </FormWrapper>
    </>
  );
};

export default React.memo(ApsForm);
