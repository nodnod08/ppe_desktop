import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useForm, Controller } from 'react-hook-form';
import CustomAlert from './../reusable/Alert';
import { ProgressSending } from './../reusable/Progress';
import { Slide, Grid, FormControl, TextField, OutlinedInput, InputLabel } from '@material-ui/core';

import { useStyles } from './styles';
import useToggle from './../reusable/useToggle';
import Confirm from './../reusable/Confirm';
import { setApi, fetchData, setAlert, setLoading } from './../../actions/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddUser({ open, setOpen, type, value }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, users, user, loading, alert } = data;

	const [firstName, setfirstName] = useState(type == 'update' ? value.firstName : '');
	const [lastName, setlastName] = useState(type == 'update' ? value.lastName : '');
	const [username, setUsername] = useState(type == 'update' ? value.username : '');
	const [password, setPassword] = useState(type == 'update' ? value.password : '');
	const [cpassword, setCPassword] = useState(type == 'update' ? value.password : '');
	const [forPassword, setForPassword] = useToggle(true);
	const [confirm, setConfirm] = useToggle(false);
	const [email, setEmail] = useState(type == 'update' ? value.email : '');
	const { register, handleSubmit, errors, control } = useForm({ mode: 'all' });

	useEffect(() => {
		return () => {
			console.log('cleaned up');
		};
	}, []);

	const onSubmit = () => {
		if (!Object.keys(errors).length) {
			setOpen();
			setConfirm();
		}
	};

	const create = () => {
		dispatch(setLoading(true));
		let formData = {
			username,
			firstName,
			lastName,
			email,
			password,
			type,
			added_by: user.user_credentials.fullName,
		};
		if (type == 'update') {
			formData.old_user = value;
		}
		axios
			.post(`${APP_URL}/api-user/update-create`, formData)
			.then(async (res) => {
				if (type != 'update' && users.total % users.rowsPerPage != 0) {
					let new_data = [...users.data];
					new_data.push(res.data.added);
					dispatch(setApi({ data: new_data, total: users.total + 1 }, 'users'));
				}
				dispatch(
					fetchData(`${APP_URL}/api-user/get-users/${users.page}/${users.rowsPerPage}`, 'users')
				);
				if (type != 'update') {
					dispatch(setAlert({ isShow: true, type: res.data.result, message: res.data.message }));
				}
			})
			.then(() => {
				dispatch(setLoading(false));
			});
	};

	return (
		<div>
			<Confirm
				open={confirm}
				message={
					type == 'create'
						? "All data is correct? Let's proceed?"
						: 'Do you really want to overwrite your info?'
				}
				onClose={() => {
					setConfirm();
					setOpen();
				}}
				onSuccess={create}
			/>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={setOpen}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				{type == 'update' ? (
					<DialogTitle id="alert-dialog-slide-title">Edit your Account</DialogTitle>
				) : (
					<DialogTitle id="alert-dialog-slide-title">
						Create New User <small>Controlling this management</small>
					</DialogTitle>
				)}
				<DialogContent>
					<Grid item xs={12}>
						{loading && type == 'create' ? <ProgressSending /> : null}
						{alert.isShow && type != 'update' ? (
							<CustomAlert type={alert.type} message={alert.message} />
						) : null}
					</Grid>
					<Grid item xs={12}>
						<FormControl className={classes.root_formcontrol}>
							<TextField
								size="small"
								label="First Name"
								name="firstName"
								defaultValue={firstName}
								error={errors.firstName}
								inputRef={register({ required: 'This field is required' })}
								onChange={(event) => {
									setfirstName(event.target.value);
								}}
								helperText={errors.firstName ? errors.firstName.message : 'First Item Name please'}
								variant="outlined"
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl className={classes.root_formcontrol}>
							<TextField
								size="small"
								label="Last Name"
								name="lastName"
								defaultValue={lastName}
								error={errors.lastName}
								inputRef={register({ required: 'This field is required' })}
								onChange={(event) => {
									setlastName(event.target.value);
								}}
								helperText={errors.lastName ? errors.lastName.message : 'Input Last Name please'}
								variant="outlined"
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl className={classes.root_formcontrol}>
							<TextField
								type="email"
								size="small"
								label="Email"
								name="email"
								defaultValue={email}
								error={errors.email}
								inputRef={register({ required: 'This field is required' })}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								helperText={errors.email ? errors.email.message : 'Input Email please'}
								variant="outlined"
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl className={classes.root_formcontrol}>
							<TextField
								size="small"
								label="Username"
								name="username"
								defaultValue={username}
								error={errors.username}
								inputRef={register({ required: 'This field is required' })}
								onChange={(event) => {
									setUsername(event.target.value);
								}}
								helperText={errors.username ? errors.username.message : 'Input Username please'}
								variant="outlined"
							/>
						</FormControl>
					</Grid>
					{type == 'create' ? (
						<React.Fragment>
							<Grid item xs={12}>
								<FormControl className={classes.root_formcontrol}>
									<TextField
										type={forPassword ? 'password' : 'text'}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={setForPassword}
														edge="end"
													>
														{!forPassword ? <Visibility /> : <VisibilityOff />}
													</IconButton>
												</InputAdornment>
											),
										}}
										size="small"
										label="Password"
										name="password"
										defaultValue={password}
										error={errors.password}
										inputRef={register({ required: 'This field is required' })}
										onChange={(event) => {
											setPassword(event.target.value);
										}}
										helperText={errors.password ? errors.password.message : 'Input Password please'}
										variant="outlined"
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl className={classes.root_formcontrol}>
									<TextField
										type={forPassword ? 'password' : 'text'}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={setForPassword}
														edge="end"
													>
														{!forPassword ? <Visibility /> : <VisibilityOff />}
													</IconButton>
												</InputAdornment>
											),
										}}
										size="small"
										label="Confirm Password"
										name="cpassword"
										defaultValue={cpassword}
										error={errors.cpassword}
										inputRef={register({
											required: 'This field is required',
											validate: (value) => value === password || 'The password do not match',
										})}
										onChange={(event) => {
											setCPassword(event.target.value);
										}}
										helperText={
											errors.cpassword ? errors.cpassword.message : 'Confirm Password please'
										}
										variant="outlined"
									/>
								</FormControl>
							</Grid>
						</React.Fragment>
					) : null}
				</DialogContent>
				<DialogActions>
					<Button onClick={setOpen} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit(onSubmit)} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
