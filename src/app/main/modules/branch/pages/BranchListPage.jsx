import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import SearchBar from '@components/SearchBar';
import { Paper } from '@mui/material';
import useBranchList from '../hooks/useBranchList';
import ApsModal from '@components/ApsModal';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const BranchListPage = ({ id_organization, disableContainer = true }) => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    branchList,
    propsModalDeleteBranch,
  } = useBranchList({ id_organization });

  const PageContent = () => (
    <>
      {propsModalDeleteBranch?.open && <ApsModal {...propsModalDeleteBranch} />}
      <Paper sx={stylesPaper}>
        <SearchBar {...propsSearchBarButton} />
        <ApsDatagrid
          rows={searchList || branchList}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
        />
      </Paper>
    </>
  );

  if (disableContainer) return <PageContent />;

  return (
    <GeneralContainer
      title="Organizaciones"
      subtitle="Listado de organizaciones."
      backTitle="Regresar"
      actions={[]}
      buttonProps={{}}
      container={<PageContent />}
    />
  );
};

export default BranchListPage;
