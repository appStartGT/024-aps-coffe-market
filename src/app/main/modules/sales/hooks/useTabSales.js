import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RemoveRedEye } from '@mui/icons-material';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { Actions, Subjects } from '@config/permissions';
import { useAuth, useMountEffect } from '@hooks';
import ApsIconButton from '@components/ApsIconButton';
import ApsListResponsive from '@components/ApsListResponsive';
import { Ability } from '@components/permissions/Can';
import { listSalesAction } from '../../../../store/modules/sales';
import { inventoryBranchListAction } from '../../../../store/modules/productInventory';
import { setSaleModalAcation } from '../../../../store/modules/sales';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import InvoicePdfButton from '../components/InvoicePdfButton';

const useTabSales = () => {
  /**Hooks */
  const dispatch = useDispatch();
  const theme = useTheme();
  const auth = useAuth();
  const ability = Ability();
  /* states */
  const [searchList, setSearchList] = useState(null);
  const [, setText] = useState('');

  /* Selectors */
  const loading = useSelector((state) => state.sales.processing);
  const list = useSelector((state) => state.sales.salesList);

  /* use Effects */
  useEffect(() => {
    const parameters = {
      createdBy: auth.user?.id_user,
      id_branch: auth.user?.id_branch,
      id_organization: auth.user?.id_organization,
    };
    if (ability.can(Actions.LIST_ALL, Subjects.VENTAS_TAB_STORE)) {
      delete parameters.createdBy; //if user is deleted, we can get all list
    }
    dispatch(
      listSalesAction({
        ...parameters,
      })
    );
  }, [auth]);

  /* Inventory of the branch */
  useMountEffect({
    effect: () => {
      const id_inventory = auth.user?.id_inventory;
      id_inventory && dispatch(inventoryBranchListAction({ id_inventory }));
    },
    deps: [auth],
  });

  const createModalProps = (item) => {
    const content = [
      {
        title: 'Cliente',
        subtitle: item.client,
      },
      {
        title: 'Fecha',
        subtitle: item.createdAtFormated,
      },
      {
        title: 'NIT',
        subtitle: item.NIT || 'NO INGRESADO',
      },
      { title: 'Total', subtitle: item.total },
      {
        title: 'Productos',
        subtitle: item.detail?.map((detail) => ({
          name: `${detail.name} x ${detail.quantity}`,
          subtotal: +detail.quantity * +detail.sale_price,
        })),
        xs: 12,
        sm: 12,
        md: 12,
      },
    ];

    return {
      open: true,
      title: 'Comprobante de pago',
      description: 'Detalle del comprobante de pago.',
      content: <ApsListResponsive list={content} />,
      closeBtn: true,
      handleOk: null,
    };
  };

  const columns = [
    {
      field: 'client',
      headerName: 'Cliente',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      // minWidth: 280,
      editable: true,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '8px 0px',
          }}
        >
          <Typography
            style={{
              maxWidth: '260px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {params.row.client}
          </Typography>
        </div>
      ),
    },
    {
      field: 'otraFecha',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '8px 0px',
          }}
        >
          <Typography
            style={{
              maxWidth: '260px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {params.row.createdAtFormated}
          </Typography>
        </div>
      ),
    },
    {
      field: 'NIT',
      headerName: 'Nit',
      headerAlign: 'center',
      align: 'center',
      // minWidth: 120,
      flex: 0.5,
    },
    {
      field: 'products',
      headerName: 'Productos',
      headerAlign: 'center',
      align: 'left',
      flex: 1.5,
      // minWidth: 300,
      renderCell: (params) => (
        <ul>
          <Tooltip
            title={
              params.row?.detail[0]?.deleted
                ? 'Este producto ya no está disponible actualmente en el producto'
                : ''
            }
          >
            <li
              style={{
                textDecoration: params?.row?.detail[0]?.deleted
                  ? 'line-through'
                  : '',
              }}
            >
              {params?.row?.detail[0]?.name}
            </li>
          </Tooltip>
          {params.row.detail.length > 1 && (
            <span
              style={{
                fontStyle: 'italic',
                color: theme.palette.text.disabled,
              }}
            >
              {`Y ${params.row.detail.length - 1} ${
                params.row.detail.length > 2 ? 'productos' : 'producto'
              } más.`}
            </span>
          )}
        </ul>
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      // minWidth: 150,
      renderCell: (params) => (
        <Typography>
          {'Q ' +
            params.row.total?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      // minWidth: 200,
      renderCell: (params) => {
        return (
          <>
            <ApsIconButton
              tooltip={{ title: 'Ver comprobante' }}
              onClick={() => {
                dispatch(
                  setApsGlobalModalPropsAction(createModalProps(params.row))
                );
              }}
              children={<RemoveRedEye />}
              can={{
                key: `can-preview-hospitalario-${params.row.id}`,
                I: Actions.PREVIEW,
                a: Subjects.VENTAS_TAB_STORE,
              }}
            />
            <InvoicePdfButton
              row={params.row}
              // onFinish={(file, url) => {
              //   if (rowFile[params.row.id]) return;
              //   setRowFile({ [params.row.id]: file });
              //   setGeneratePDF(null);
              //   window.open(url, '_blank');
              // }}
            />
          </>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Cliente / Nit',
    type: 'text',
    searchList: list,
    searchKey: 'client,NIT',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => {
        dispatch(setSaleModalAcation(true));
      },
      color: 'primary',
      can: {
        key: 'can-create-school',
        I: Actions.CREATE,
        a: Subjects.VENTAS_TAB_STORE,
      },
    },
  };

  return {
    list,
    propsSearchBarButton,
    columns,
    loading,
    searchList,
  };
};

export default useTabSales;
