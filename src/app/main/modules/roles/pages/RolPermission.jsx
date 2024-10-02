import React from 'react';
import { Grid, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import SubjectList from '../components/SubjectList';
import PermissionList from '../components/PermissionList';
import useRolPermissions from '../hooks/useRolPermissions';
import CreateItemsModal from '../components/CreateItemsModal';
import useSubject from '../hooks/useSubject';
import useAction from '../hooks/useAction';

const stylesGridSubjects = {
  padding: {
    md: '0px 24px',
    xs: '0px',
  },
  borderRight: {
    md: '0.5px solid rgba(0, 0, 0, 0.3);',
    xs: 'none',
  },
  margin: {
    md: '0px',
    xs: '0px auto 20px auto',
  },
};

const stylesGridPermissions = {
  padding: {
    md: '0px 24px',
    xs: '0px',
  },
  height: '100%',
  margin: {
    md: '0px',
    xs: '0px auto',
  },
};

const RolPermission = () => {
  /* Hooks */
  const {
    selectedSubject,
    propsSubjectList,
    propsPermissionList,
    propsSearchBarSubjects,
    propsSearchBarPermissions,
  } = useRolPermissions();
  const {
    formik: formikSubject,
    handleOnClick: handleOnClickSubject,
    open: openSubject,
    setOpen: setOpenSubjet,
    processing: processingSubject,
  } = useSubject();

  const {
    formik: formikAction,
    handleOnClick: handleOnClickAction,
    open: openAction,
    setOpen: setOpenAction,
  } = useAction();

  return (
    <Grid container>
      <CreateItemsModal
        open={openSubject}
        setOpen={setOpenSubjet}
        formik={formikSubject}
        handleOnclick={handleOnClickSubject}
        loading={processingSubject}
      />
      <CreateItemsModal
        open={openAction}
        setOpen={setOpenAction}
        formik={formikAction}
        handleOnclick={handleOnClickAction}
        loading={processingSubject}
      />
      <Grid item md={4} xs={12} sx={stylesGridSubjects}>
        <Typography
          children="Selecciona una pantalla."
          variant="h6"
          color="primary"
          marginBottom={'12px'}
        />
        <SearchBar
          {...propsSearchBarSubjects}
          rightButton={{
            icon: 'add_circle',
            onClick: () => setOpenSubjet(true),
            color: 'primary',
            // can: {
            //   key: 'can-create-services-record',
            //   I: Actions.CREATE,
            //   a: Subjects.HOSTPITALARIO,
            // },
          }}
        />
        <SubjectList {...propsSubjectList} />
      </Grid>
      <Grid item md={8} xs={12} sx={stylesGridPermissions}>
        <Typography
          children="Habilitar permisos"
          variant="h6"
          color="primary"
          marginBottom={'12px'}
        />
        <SearchBar
          {...propsSearchBarPermissions}
          rightButton={{
            icon: 'add_circle',
            onClick: () => setOpenAction(true),
            color: 'primary',
            disabled: !selectedSubject,
            // can: {
            //   key: 'can-create-services-record',
            //   I: Actions.CREATE,
            //   a: Subjects.HOSTPITALARIO,
            // },
          }}
        />
        {selectedSubject && <PermissionList {...propsPermissionList} />}
      </Grid>
    </Grid>
  );
};

export default RolPermission;
