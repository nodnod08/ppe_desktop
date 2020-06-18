import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const MyHead = ({ columns }) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map((col, i) => (
          <TableCell key={i} align="center">
            {col.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const MyCell = ({ column, data }) => {
  return column.type == 'action' ? (
    column.render(data)
  ) : (
    <TableCell key={data.id} align="center">
      {data[column.id]}
    </TableCell>
  );
};

const Empty = ({ columns }) => {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell align="center" colSpan={columns.length}>
        EMPTY
      </TableCell>
    </TableRow>
  );
};

const PPETable = ({
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  total,
  data,
  page,
  columns,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <MyHead columns={columns} />
            <TableBody>
              {data.length ? (
                data.map((row, index) => (
                  <TableRow hover tabIndex={-1} key={index}>
                    {columns.map((col, ind) => (
                      <MyCell key={ind} column={col} data={row} />
                    ))}
                  </TableRow>
                ))
              ) : (
                <Empty columns={columns} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default PPETable;
