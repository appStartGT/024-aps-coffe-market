import React from 'react';
import { Paper } from '@mui/material';
import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import SearchBar from '@components/SearchBar';
import useRolList from '../hooks/useRolList';
import ApsModalDelete from '@components/ApsModalDelete';
import CreateRolModal from '../components/CreateRolModal';
import useCreateRol from '../hooks/useCreateRol';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const RolListPage = ({ disableContainer = false }) => {
  const {
    handleDelete,
    onClose,
    roleList,
    columns,
    processing,
    searchBarProps,
    searchList,
    isModalOpen,
    selectedRole,
    openCreateModal,
    setOpenCreateModal,
  } = useRolList();

  const { formik, handleOnClick } = useCreateRol();

  const PageContent = () => (
    <Paper sx={stylesPaper}>
      <SearchBar {...searchBarProps} />
      <ApsDatagrid
        searchByKey="name"
        rows={searchList || roleList}
        columns={columns}
        loading={processing}
      />
    </Paper>
  );

  return (
    <>
      <ApsModalDelete
        title={'Eliminar rol'}
        text={`Esta seguro que desea eliminar el rol "${selectedRole?.name}" permanentemente?`}
        open={isModalOpen}
        handleOk={handleDelete}
        onClose={onClose}
        processing={processing}
      />
      <CreateRolModal
        open={openCreateModal}
        formik={formik}
        setOpen={setOpenCreateModal}
        handleOnclick={handleOnClick}
      />
      {disableContainer ? (
        PageContent()
      ) : (
        <GeneralContainer
          title="Roles"
          subtitle="General list of roles."
          container={PageContent()}
        />
      )}
    </>
  );
};

export default React.memo(RolListPage);
