import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import clsx from 'clsx';

import PPETable from './../reusable/PPETable';
import { setApi, fetchData, setLoading } from './../../actions/actions';
import columns from './columns';
import { useStyles, useToolbarStyles } from './styles';
import useToggle from './../reusable/useToggle';
import AddUser from './AddUser';

const EnhancedTableToolbar = () => {
	const classify = useToolbarStyles();
	const [add, setAdd] = useToggle(false);

	return (
		<React.Fragment>
			<AddUser type="create" open={add} setOpen={setAdd} />
			<Toolbar
				className={clsx(classify.root, {
					[classify.highlight]: true,
				})}
			>
				<Tooltip title="Add User">
					<IconButton onClick={setAdd} aria-label="Add User">
						<PersonAddIcon />
					</IconButton>
				</Tooltip>
			</Toolbar>
		</React.Fragment>
	);
};

const UserPage = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, users, loading } = data;

	useEffect(() => {
		dispatch(setLoading(true));
		dispatch(
			fetchData(`${APP_URL}/api-user/get-users/${users.page}/${users.rowsPerPage}`, 'users')
		);
	}, []);

	const handleChangePage = (event, newPage) => {
		dispatch(setLoading(true));
		dispatch(
			setApi(
				{
					page: newPage + 1,
					rowsPerPage: users.rowsPerPage,
				},
				'users'
			)
		);
		dispatch(
			fetchData(`${APP_URL}/api-user/get-users/${newPage + 1}/${users.rowsPerPage}`, 'users')
		);
	};

	const handleChangeRowsPerPage = (event) => {
		dispatch(setLoading(true));
		const numRows = event.target.value;
		let remain = users.total % numRows;
		let pp = (users.total % numRows) + remain;

		dispatch(
			setApi(
				{
					page: users.page != 1 ? (pp != users.page ? users.page - 1 : users.page) : users.page,
					rowsPerPage: numRows,
				},
				'users'
			)
		);

		dispatch(
			fetchData(
				`${APP_URL}/api-users/get-users/${
					users.page != 1 ? (pp != users.page ? users.page - 1 : users.page) : users.page
				}/${numRows}`,
				'users'
			)
		);
	};

	return (
		<React.Fragment>
			<PPETable
				tool={true}
				toolbox={<EnhancedTableToolbar />}
				loading={loading}
				datas={users.data || []}
				rowsPerPage={users.rowsPerPage}
				total={users.total}
				columns={columns}
				page={users.page - 1}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</React.Fragment>
	);
};

export default UserPage;
