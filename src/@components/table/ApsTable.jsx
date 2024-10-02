import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import {
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import ApsTextField from '@components/ApsTextField';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

const CustomTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 56,
      },
    },
  },
})(ApsTextField);

export default function ApsTable({ columns, rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
      <Grid
        container
        style={{
          padding: '12px',
          marginTop: '12px',
        }}
      >
        <CustomTextField
          variant="outlined"
          gridItem
          gridProps={{ md: 6, sm: 8, xs: 9 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Grid
          item
          md={6}
          sm={4}
          xs={3}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Fab color="primary">
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <Typography
                    color="primary"
                    variant={'h6'}
                    children={column.label}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={index} align={column.align}>
                          {typeof value === 'function' ? (
                            <IconButton onClick={() => row['acciones'](row)}>
                              <EditIcon />
                            </IconButton>
                          ) : (
                            <Typography
                              color={value === 'INACTIVA' ? 'error' : ''}
                              children={value}
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count}`
        }
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
