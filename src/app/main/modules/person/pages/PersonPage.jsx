import React from 'react';
import { Paper } from '@mui/material';
import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import SearchBar from '@components/SearchBar';
import usePersonList from '../hooks/usePersonList';
import CreatePersonModal from '../components/CreatePersonModal';
import ApsModalDelete from '@components/ApsModalDelete';
import { Subjects } from '@config/permissions';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const PersonsPage = ({
  disableContainer = false,
  subject = Subjects.ADMINISTRADOR_TAB_PERSONALEXT,
}) => {
  const {
    onClose,
    handleDelete,
    columns,
    personList,
    processing,
    searchList,
    searchBarProps,
    selectedPerson,
    isDeleteModalOpen,
  } = usePersonList({
    subject,
  });

  const PageContent = () => (
    <Paper sx={stylesPaper}>
      <SearchBar {...searchBarProps} />
      <ApsDatagrid
        rows={searchList || personList}
        columns={columns}
        loading={processing}
      />
    </Paper>
  );

  return (
    <>
      <ApsModalDelete
        title={'Eliminar personal externo'}
        text={`Esta seguro que desea elminar a "${selectedPerson?.fullName}" permanentemente?`}
        open={isDeleteModalOpen}
        handleOk={handleDelete}
        onClose={onClose}
        processing={processing}
      />
      <CreatePersonModal />
      {disableContainer ? (
        PageContent()
      ) : (
        <GeneralContainer
          title="Personal"
          subtitle="Listado de personas"
          container={PageContent()}
        />
      )}
    </>
  );
};

export default PersonsPage;
