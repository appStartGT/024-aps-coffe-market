import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Badge, Chip, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import SkeletonDatagrid from './generalContainer/SkeletonDatagrid';

const columnsLocal = [
  {
    field: 'id',
    headerName: 'No. Application',
    width: 180,
    renderCell: (params) => (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
        <Badge badgeContent={4} color="error">
          <EmailIcon color="action" />
        </Badge>
        <Typography variant="body2">{params.value}</Typography>
      </div>
    ),
  },
  {
    field: 'applicantName',
    headerName: 'Applicant',
    width: 160,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 160,
    editable: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    type: 'number',
    width: 130,
    editable: true,
  },
  {
    field: 'grade',
    headerName: 'Grade',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    align: 'center',
    headerAlign: 'center',
    // valueGetter: (params) =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Chip
        color={
          params.value === 'LEAD'
            ? 'warning'
            : params.value === 'CONTACTED'
            ? 'secondary'
            : 'primary'
        }
        label={params.value}
      />
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 'fullWidth',
    align: 'center',
    headerAlign: 'center',
    flex: 1,
    renderCell: (params) => (
      <>
        <IconButton onClick={() => console.log('Editando: ', params.row)}>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => console.log('Descargando: ', params.row)}>
          <DownloadIcon color="primary" />
        </IconButton>
      </>
    ),
  },
];

const rowsLocal = [
  {
    id: 'A-2022-135',
    applicantName: 'Jonh Doe Smith',
    email: 'Joe@gmail.com',
    phone: '+1-521-45685',
    grade: 'First',
    status: 'APPLIED',
  },
  {
    id: 'A-2022-136',
    applicantName: 'Jonh Doe Smith',
    email: 'Joe@gmail.com',
    phone: '+1-521-45685',
    grade: 'First',
    status: 'CONTACTED',
  },
  {
    id: 'A-2022-137',
    applicantName: 'Jonh Doe Smith',
    email: 'Joe@gmail.com',
    phone: '+1-521-45685',
    grade: 'First',
    status: 'APPLIED',
  },
  {
    id: 'A-2022-138',
    applicantName: 'Jonh Doe Smith',
    email: 'Joe@gmail.com',
    phone: '+1-521-45685',
    grade: 'First',
    status: 'LEAD',
  },
  {
    id: 'A-2022-139',
    applicantName: 'Jonh Doe Smith',
    email: 'Joe@gmail.com',
    phone: '+1-521-45685',
    grade: 'First',
    status: 'CONTACTED',
  },
  {
    id: 'A-2022-140',
    applicantName: 'Jonh Doe Smith',
    email: 'Joe@gmail.com',
    phone: '+1-521-45685',
    grade: 'First',
    status: 'CONTACTED',
  },
];

const ApsDatagrid = ({
  rows = rowsLocal,
  columns = columnsLocal,
  contentHeader = null,
  sx: sxProp,
  sxContainerProps,
  skeleton = false,
  ...props
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page on page size change
  };

  const sx = {
    '.MuiDataGrid-columnSeparator': {
      display: 'none',
    },
    '.MuiDataGrid-columnHeaderTitle': {
      color: '#094067',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '20px',
    },
    '.MuiDataGrid-columnHeader': {
      paddingLeft: '16px',
      paddingRight: '0px',
    },
    '.MuiDataGrid-cell': {
      paddingLeft: '16px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      fontSize: '14px',
    },
    ' .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '.MuiDataGrid-columnHeader:focus': {
      outline: 'none',
    },
    ...sxProp, // Propiedades `sx` nuevas
  };

  return skeleton ? (
    <SkeletonDatagrid />
  ) : (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        width: '100%',
        borderRadius: '8px',
        ...sxContainerProps,
      }}
    >
      {contentHeader && contentHeader}
      <DataGrid
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={sx}
        autoHeight={true}
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[5, 10, 25, 100]}
        pagination
        page={page}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        sortingOrder={['asc', 'desc', null]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowHeight={() => 'auto'}
        headerHeight={35}
        {...props}
      />
    </Box>
  );
};

export default React.memo(ApsDatagrid);
