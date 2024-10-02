import React from 'react';
import { Paper } from '@mui/material';
import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import SearchBar from '@components/SearchBar';
import useUserList from '../hooks/useUserList';
import CreateUserModal from '../components/CreateUserModal';
import ApsModalDelete from '@components/ApsModalDelete';
import { Subjects } from '@config/permissions';
import { CatUserType } from '@utils';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const UsersPage = ({
  disableContainer = false,
  subject = Subjects.ADMINISTRADOR_TAB_USUARIOS,
  id_user_type = CatUserType.SYSTEM,
  id_organization,
  id_branch,
}) => {
  const {
    onClose,
    handleDelete,
    columns,
    userList,
    processing,
    searchList,
    searchBarProps,
    selectedUser,
    isDeleteModalOpen,
  } = useUserList({
    subject,
    id_user_type,
    id_organization,
    id_branch,
  });

  const PageContent = () => (
    <Paper sx={stylesPaper}>
      <SearchBar {...searchBarProps} />
      <ApsDatagrid
        rows={searchList || userList}
        columns={columns}
        loading={processing}
        sxContainerProps={{
          height: 500,
        }}
        autoHeight={false}
      />
    </Paper>
  );

  return (
    <>
      <ApsModalDelete
        title={'Eliminar usuario'}
        text={`Esta seguro que desea elminar el usuario "${selectedUser?.name}" permanentemente?`}
        open={isDeleteModalOpen}
        handleOk={handleDelete}
        onClose={onClose}
      />
      <CreateUserModal
        id_user_type={id_user_type}
        id_organization={id_organization}
        id_branch={id_branch}
      />
      {disableContainer ? (
        PageContent()
      ) : (
        <GeneralContainer
          title="Users"
          subtitle="General list of users."
          container={PageContent()}
        />
      )}
    </>
  );
};

export default UsersPage;
