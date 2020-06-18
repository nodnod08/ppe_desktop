import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PPETable from './../../reusable/PPETable';
import { setApi, fetchData } from './../../../actions/actions';
import columns from './columns';

const ItemsList = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.main);
  const { APP_URL, api } = data;

  useEffect(() => {
    dispatch(fetchData(`${APP_URL}/api-items/get-items/${api.page}/${api.rowsPerPage}`));
  }, []);

  const handleChangePage = (event, newPage) => {
    dispatch(
      setApi({
        page: newPage + 1,
        rowsPerPage: api.rowsPerPage,
      })
    );
    dispatch(fetchData(`${APP_URL}/api-items/get-items/${api.page}/${api.rowsPerPage}`));
  };

  const handleChangeRowsPerPage = (event) => {
    const numRows = event.target.value;
    dispatch(
      setApi({
        page: api.page,
        rowsPerPage: numRows,
      })
    );
    dispatch(fetchData(`${APP_URL}/api-items/get-items/${api.page}/${api.rowsPerPage}`));
  };

  return (
    <PPETable
      data={api.data || []}
      rowsPerPage={api.rowsPerPage}
      total={api.total}
      columns={columns}
      page={api.page - 1}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default ItemsList;
