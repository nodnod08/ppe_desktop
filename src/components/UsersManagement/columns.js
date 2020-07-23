import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Confirm from './../reusable/Confirm';
import useToggle from './../reusable/useToggle';
import { deleteItem } from './../../actions/actions';
import AddUser from './AddUser';

const Action = ({ value }) => {
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, users, user } = data;
	const [confirm, setConfirm] = useToggle(false);
	const [edit, setEdit] = useToggle(false);
	const delete_user = () => {
		dispatch(
			deleteItem(
				`${APP_URL}/api-user/delete-item`,
				`${APP_URL}/api-user/get-users/${
					users.total % users.rowsPerPage == 1
						? users.page > 1
							? users.page - 1
							: users.page
						: users.page
				}/${users.rowsPerPage}`,
				value,
				users,
				'users'
			)
		);
	};
	return (
		<React.Fragment>
			<Confirm
				open={confirm}
				message="Do you really want to delete this User?"
				onClose={setConfirm}
				onSuccess={delete_user}
			/>
			<AddUser type="update" value={value} open={edit} setOpen={setEdit} />
			<IconButton onClick={setConfirm} aria-label="delete">
				<DeleteIcon />
			</IconButton>
			{user.user_credentials._id == value._id ? (
				<IconButton onClick={setEdit} aria-label="delete">
					<EditIcon />
				</IconButton>
			) : null}
		</React.Fragment>
	);
};

const columns = [
	{
		type: 'number',
		id: 'number',
		label: '#',
	},
	{
		id: 'action',
		label: 'Action',
		type: 'action',
		render: (data) => <Action value={data} />,
	},
	{
		id: 'userType',
		label: 'User Type',
		type: 'string',
	},
	{
		id: 'fullName',
		label: 'Full Name',
		type: 'string',
	},
	{
		id: 'username',
		label: 'Username',
		type: 'string',
	},
	{
		label: 'Email',
		type: 'string',
		id: 'email',
	},
	{
		id: 'added_by',
		label: 'Added By',
		type: 'string',
	},
	{
		id: 'created_at',
		label: 'Created Date',
		type: 'string',
	},
];

export default columns;
