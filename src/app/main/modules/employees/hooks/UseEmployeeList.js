import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  employeeListAction,
  employeeDeleteAction,
} from '../../../../store/modules/employee/index';
import { Actions, Subjects } from '@config/permissions';
import { useAuth } from '@hooks';
import { branchListAction } from '../../../../store/modules/branch/index';
// import { Ability } from '@components/permissions/Can';

const UseEmployeeList = () => {
  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  // const ability = Ability();

  /* selectors */
  const employeeList = useSelector((state) => state.employee.employeeList);
  const totalItems = useSelector((state) => state.employee.totalItems);
  const processing = useSelector((state) => state.employee.processing);
  /* STATES */
  /* Search */
  const [searchList, setSearchList] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 1,
  });
  const [, setText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const branchList = useSelector((state) => state.branch.branchListForSelect);
  /* use Effects */

  useEffect(() => {
    dispatch(
      branchListAction({ id_organization: auth?.user?.id_organization })
    );
    dispatch(
      employeeListAction({
        id_organization: auth?.user?.id_organization,
        id_branch: auth?.user?.id_branch,
      })
    );
  }, []);

  const handlePageChange = (newPage) => {
    setPaginationModel((value) => ({ ...value, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPaginationModel((value) => ({ ...value, pageSize: newPageSize }));
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'telephone',
      headerName: 'Teléfono',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'address',
      headerName: 'Dirección',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'job',
      headerName: 'Puesto',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'sucursal',
      headerName: 'Sucursal',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 170,
      sticky: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {params.row.id_employee && (
              <ApsIconButton
                tooltip={{ title: 'Editar registro' }}
                onClick={() =>
                  navigate(`/main/employee/detail/${params.row.id_employee}`)
                }
                children={<Edit color="" />}
                can={{
                  key: `can-edit-employee-${params.row.id_employee}`,
                  I: Actions.EDIT,
                  a: Subjects.EMPLOYEES,
                }}
              />
            )}
            {params.row.id_employee && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar empleado' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                can={{
                  key: `can-delete-employee-${params.row.id_employee}`,
                  I: Actions.DELETE,
                  a: Subjects.EMPLOYEES,
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Nombre / Direccion / Teléfono / Puesto  ',
    type: 'text',
    searchList: employeeList,
    searchKey: 'name, email, job, address',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => navigate(`/main/employee/detail/0`),
      color: 'primary',
      can: {
        key: 'can-create-services-record',
        I: Actions.CREATE,
        a: Subjects.EMPLOYEES,
      },
    },
    dropdown: {
      label: 'Sucursales',
      placeholder: '',
      value: statusFilter,
      onChange: function ({ target: { value } }) {
        setStatusFilter(value);
        if (value !== 1) {
          const resultadoFiltrado = employeeList.filter(
            (empleado) => empleado.id_branch === value
          );

          setSearchList(resultadoFiltrado);
        } else {
          setSearchList(employeeList);
        }
      },
      options: [...branchList, { value: 1, label: 'Todas' }],
    },
  };

  const handleCloseDelete = () => {
    setEmployeeToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setEmployeeToDelete(data);
  };

  const handleDelete = () => {
    dispatch(
      employeeDeleteAction({
        id_employee: employeeToDelete.id_employee,
      })
    );
    setOpenModalDelete(false);
  };

  const propsModalDeleteOrganization = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar empleado',
    content: (
      <Typography>{`Está seguro que desea eliminar la empleado "${employeeToDelete.name}" permanentemente?`}</Typography>
    ),
    handleOk: () => handleDelete(),
    titleOk: 'Eliminar',
    handleCancel: () => handleCloseDelete(),
    titleCancel: 'Cancelar',
    okProps: {
      color: 'error',
      endIcon: <Delete />,
    },
  };
  const labels = {
    name: 'Nombre',
    address: 'Dirección',
    email: 'Correo',
    job: 'Puesto',
    telephone: 'Telefono',
  };
  const fields = ['name', 'address', 'email', 'sucursal', 'job', 'telephone'];

  return {
    columns,
    handlePageChange,
    handlePageSizeChange,
    employeeList,
    pageSize,
    paginationModel,
    processing,
    propsModalDeleteOrganization,
    propsSearchBarButton,
    searchList,
    setPaginationModel,
    setSearchList,
    totalItems,
    labels,
    fields,
  };
};

export default UseEmployeeList;
