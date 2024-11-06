import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography } from '@mui/material';
//import useScanDetection from 'use-scan-detection';

import SearchBar from '@components/SearchBar';
import ApsDatagrid from '@components/ApsDatagrid';
import { Actions, Subjects } from '@config/permissions';
import { Delete, Edit, PictureAsPdf, Save } from '@mui/icons-material';
import { fieldValidations } from '@utils';
import ApsModal from '@components/ApsModal';
import { useFormikFields } from '@hooks';
import ApsForm from '@components/ApsForm';
import { employeeUpdateAction } from '../../../../store/modules/employee/index';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ApsIconButton from '@components/ApsIconButton';
import { BlobProvider } from '@react-pdf/renderer';
import PDFPagos from '@components/application-pdfs/PDFPagos';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const PaymentsList = ({
  employeePaymentSelected,
  processing,
  subject = Subjects.EMPLOYEES_TAB_PAGOS,
  employeeSelected,
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { id_employee } = useParams();
  const [searchList, setSearchList] = useState(null);
  const [meses, setMeses] = useState([]);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [paymentToDelete, setEmployeeToDelete] = useState({});
  const [year] = useState(new Date().getFullYear().toString());
  const allMonths = [
    { value: 1, label: 'ENERO' },
    { value: 2, label: 'FEBRERO' },
    { value: 3, label: 'MARZO' },
    { value: 4, label: 'ABRIL' },
    { value: 5, label: 'MAYO' },
    { value: 6, label: 'JUNIO' },
    { value: 7, label: 'JULIO' },
    { value: 8, label: 'AGOSTO' },
    { value: 9, label: 'SEPTIEMBRE' },
    { value: 10, label: 'OCTUBRE' },
    { value: 11, label: 'NOVIEMBRE' },
    { value: 12, label: 'DICIEMBRE' },
  ];

  useEffect(() => {
    const usedMonths = employeePaymentSelected
      .filter((item) => item.year === +year) // Filtra por el año actual
      .map((item) =>
        typeof item.month === 'object' ? item.month.value : item.month
      );
    const filteredMonths = allMonths.filter(
      (month) => !usedMonths.includes(month.value)
    );
    setMeses(filteredMonths);
  }, [employeePaymentSelected]);

  /* Constants */
  const columns = [
    {
      field: 'payment',
      headerName: 'Monto',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'onlyMonth',
      headerName: 'Mes',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'year',
      headerName: 'Año',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: 'Descripcion',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        let valor = moment(params?.row.createdAt, 'YYYY-MM-DD');

        return (
          <Typography
            variant="body2"
            style={{
              fontWeight: 'normal',
            }}
          >
            {valor.format('DD/MM/YYYY')}{' '}
            {/* Usar .format para convertir la fecha a un string */}
          </Typography>
        );
      },
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
            <ApsIconButton
              tooltip={{ title: 'Editar registro' }}
              onClick={() => {
                formikPayment.form.setValues(params.row);
                setOpen(true);
              }}
              children={<Edit color="" />}
              can={{
                key: `can-edit-employee-${params.row.id}`,
                I: Actions.EDIT,
                a: Subjects.EMPLOYEES_TAB_PAGOS,
              }}
            />
            <ApsIconButton
              tooltip={{ title: 'Eliminar pago' }}
              onClick={() => handleOpenDelete(params.row)}
              children={<Delete color="error" />}
              can={{
                key: `can-delete-employee-${params.row.id}`,
                I: Actions.DELETE,
                a: Subjects.EMPLOYEES_TAB_PAGOS,
              }}
            />

            <BlobProvider
              document={
                <PDFPagos
                  title={`Pago ${params.row?.onlyMonth}`}
                  content={params.row}
                />
              }
            >
              {({ url }) => (
                <ApsIconButton
                  tooltip={{ title: 'Generar pdf' }}
                  children={<PictureAsPdf />}
                  onClick={() => window.open(url, '_blank')}
                />
              )}
            </BlobProvider>
          </div>
        );
      },
    },
  ].filter((e) => e);

  const searchBarProps = {
    label: 'Busqueda por mes / descripcion / monto',
    type: 'text',
    searchList: employeePaymentSelected,
    searchKey: 'description,payment,onlyMonth',
    searchResults: (results) => setSearchList(results),
    rightButton: {
      icon: 'add_circle',
      onClick: () => setOpen(true),
      color: 'primary',
      can: {
        key: `can-create-user-${subject}`,
        I: Actions.CREATE,
        a: subject,
      },
    },
  };
  const formikPayment = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Monto',
        name: 'payment',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
        value: employeeSelected?.salario,
      },
      {
        id: '2',
        label: 'Mes',
        name: 'month',
        field: 'autocomplete',
        gridItem: true,
        gridProps: { md: 4 },
        validations: fieldValidations.requiredSelect,
        options: meses,
      },
      {
        id: '4',
        label: 'Año',
        name: 'year',
        value: year,

        gridItem: true,
        gridProps: { md: 4 },
        validations: fieldValidations.number,
      },
      {
        id: '13',
        label: 'Descripción',
        name: 'description',
        gridItem: true,
        multiline: true,
        rows: 4,
        gridProps: { md: 12 },
        inputProps: { maxLength: 3000 },
        validations: fieldValidations.description,
      },
    ],
  });

  const propsModalRegistroPago = {
    open: open,
    onClose: () => handleClose(),
    maxWidth: 'md',
    title: 'Crear Pago',
    description: 'Complete los campos requeridos para crear el pago.',
    content: <ApsForm title="" formik={formikPayment} />,
    handleOk: () => handleOnclick(),
    titleOk: 'Crear pago',
    handleCancel: () => handleClose(),
    titleCancel: 'Cancelar',
    okProps: {
      disabled: !formikPayment.form.isValid || processing,
      endIcon: <Save />,
    },
  };

  const handleClose = () => {
    setOpen(false);
    formikPayment.clearForm();
  };

  const handleOnclick = () => {
    if (formikPayment.form.values.id) {
      const index = employeePaymentSelected.findIndex(
        (payment) => payment.id === formikPayment.form.values.id
      );

      if (index !== -1) {
        // Asegura que el índice existe
        // Copia el arreglo original y actualiza el índice encontrado
        const updatedPayments = [...employeePaymentSelected];
        updatedPayments[index] = {
          ...updatedPayments[index],
          ...formikPayment.form.values,
          year: +formikPayment.form.values.year,
        };

        // Envía la acción de actualización
        dispatch(
          employeeUpdateAction({
            id_employee: id_employee,
            ...employeeSelected,
            payments: updatedPayments,
          })
        ).then(() => {
          handleClose(); // Cierra el modal o formulario después de actualizar
        });
      }
    } else {
      const ahora = new Date();
      const fechaHoraISO = ahora.toISOString();
      let payments = [
        ...employeePaymentSelected,
        {
          ...formikPayment.form.values,
          createdAt: fechaHoraISO,
          id: employeePaymentSelected.length + 1,
          year: +formikPayment.form.values.year,
        },
      ];
      dispatch(
        employeeUpdateAction({
          id_employee: id_employee,
          ...employeeSelected,
          payments,
        })
      ).then(() => {
        handleClose();
      });
    }
  };

  const handleDelete = () => {
    const updatedPayments = employeePaymentSelected.filter(
      (payment) => payment.id !== paymentToDelete.id
    );

    // Envía la acción de actualización con el arreglo filtrado
    dispatch(
      employeeUpdateAction({
        id_employee: id_employee,
        ...employeeSelected,
        payments: updatedPayments,
      })
    ).then(() => {
      handleClose(); // Cierra el modal o formulario después de eliminar
    });
    setOpenModalDelete(false);
  };

  const propsModalDeleteOrganization = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar Pago',
    content: (
      <Typography>{`Está seguro que desea eliminar Pago "${paymentToDelete.onlyMonth}" permanentemente?`}</Typography>
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

  const handleCloseDelete = () => {
    setEmployeeToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setEmployeeToDelete(data);
  };

  return (
    <>
      <Paper sx={stylesPaper}>
        <SearchBar {...searchBarProps} />
        <ApsDatagrid
          rows={searchList || employeePaymentSelected}
          columns={columns}
          loading={processing}
          sxContainerProps={{
            height: 500,
          }}
          autoHeight={false}
        />
      </Paper>
      {propsModalRegistroPago.open && <ApsModal {...propsModalRegistroPago} />}
      {propsModalDeleteOrganization.open && (
        <ApsModal {...propsModalDeleteOrganization} />
      )}
    </>
  );
};

export default PaymentsList;
