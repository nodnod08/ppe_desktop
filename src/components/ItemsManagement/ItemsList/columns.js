import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Confirm from './../../reusable/Confirm';
import useToggle from './../../reusable/useToggle';
import { deleteItem } from './../../../actions/actions';
import EditItem from './EditItem';

const Action = ({ value }) => {
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, api } = data;
	const [confirm, setConfirm] = useToggle(false);
	const [edit, setEdit] = useToggle(false);
	const delete_item = () => {
		dispatch(
			deleteItem(
				`${APP_URL}/api-items/delete-item`,
				`${APP_URL}/api-items/get-items/${
					api.total % api.rowsPerPage == 1 ? (api.page > 1 ? api.page - 1 : api.page) : api.page
				}/${api.rowsPerPage}`,
				value,
				api
			)
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
			{edit && <EditItem value={value} open={edit} setOpen={setEdit} />}
			<IconButton onClick={setConfirm} aria-label="delete">
				<DeleteIcon />
			</IconButton>
			<IconButton onClick={setEdit} aria-label="delete">
				<EditIcon />
			</IconButton>
		</React.Fragment>
	);
};

const Brand = ({ data }) => {
	return (
		<p style={{ fontSize: 15 }}>
			{data.brand.brand_name} - {data.brand.is_colored ? 'COLORED' : 'MONOCHROME'}
		</p>
	);
};

const Category = ({ data }) => {
	return <p style={{ fontSize: 15 }}>{data.brand.category}</p>;
};

const Content = ({ data }) => {
	return (
		<p style={{ fontSize: 15 }}>
			{data.brand.brand_name} - {data.brand.is_colored ? 'COLORED' : 'MONOCHROME'}
		</p>
	);
};

const columns = [
	{
		id: 'action',
		label: 'Action',
		type: 'action',
		render: (data) => <Action value={data} />,
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
