import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Confirm from './../../reusable/Confirm';
import useToggle from './../../reusable/useToggle';
import { deleteItem } from './../../../actions/actions';

const Delete = ({ value }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.main);
  const { APP_URL, api } = data;
  const [confirm, setConfirm] = useToggle(false);
  const delete_item = () => {
    dispatch(
      deleteItem(`${APP_URL}/api-items/delete-item/${api.page}/${api.rowsPerPage}`, value.id)
    );
  };
  return (
    <React.Fragment>
      <Confirm
        open={confirm}
        message="Do you really want to delete this item?"
        onClose={setConfirm}
        onSuccess={delete_item}
      />
      <IconButton onClick={setConfirm} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </React.Fragment>
  );
};

const Brand = ({ data }) => {
  return 'hello';
};

const Category = ({ data }) => {
  return 'hello';
};

const Content = ({ data }) => {
  return 'hello';
};

const columns = [
  {
    id: 'item_name',
    label: 'Item Name',
    type: 'action',
    render: (data) => <Delete data={data} />,
  },
  {
    id: 'item_name',
    label: 'Item Name',
    type: 'string',
  },
  {
    label: 'Category',
    type: 'relation',
    render: (data) => <Category data={data} />,
  },
  {
    label: 'Brand',
    type: 'relation',
    render: (data) => <Brand data={data} />,
  },
  {
    id: 'stocks',
    label: 'Stocks',
    type: 'string',
  },
  {
    id: 'content',
    label: 'Stocks',
    type: 'actions',
    render: (data) => <Content data={data} />,
  },
];

export default columns;
