import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Slide, Grid, FormControl, TextField } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { useForm, Controller } from 'react-hook-form';
import CustomAlert from './../reusable/Alert';
import { ProgressSending } from './../reusable/Progress';
import axios from 'axios';

import useToggle from './../reusable/useToggle';
import Confirm from './../reusable/Confirm';
import { useStyles } from './styles';
import { setApi, fetchData, setAlert, setLoading } from './../../actions/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChangePass({ open, setOpen }) {
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, users, user, loading, alert } = data;
	const classes = useStyles();
	const [npassword, setnPassword] = useState('');
	const [opassword, setoPassword] = useState('');
	const [cpassword, setcPassword] = useState('');
	const [forPassword, setForPassword] = useToggle(true);
	const [confirm, setConfirm] = useToggle(false);
	const { register, handleSubmit, errors, control } = useForm({ mode: 'all' });

	// useEffect(() => {
	// 	return () => {
	// 		console.log('cleaned up');
	// 	};
	// }, []);

	const onSubmit = () => {
		if (!Object.keys(errors).length) {
			setOpen();
			setConfirm();
		}
	};

	const change = () => {
		dispatch(setLoading(true));
		let formData = {
			opassword,
			npassword,
			cpassword,
			old_user: user.user_credentials,
		};
		axios
			.post(`${APP_URL}/api-user/change-pass`, formData)
			.then(async (res) => {
				dispatch(setAlert({ isShow: true, type: res.data.result, message: res.data.message }));
			})
			.then(() => {
				dispatch(setLoading(false));
			});
	};

	return (
		<div>
			<Confirm
				open={confirm}
				message="Are you sure? All credentials are correct?"
				onClose={() => {
					setConfirm();
					setOpen();
				}}
				onSuccess={change}
			/>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={setOpen}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">Change Your Password</DialogTitle>
				<DialogContent>
					<Grid item xs={12}>
						{loading ? <ProgressSending /> : null}
						{alert.isShow ? <CustomAlert type={alert.type} message={alert.message} /> : null}
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
								label="Your Old Password"
								name="opassword"
								defaultValue={opassword}
								error={errors.opassword}
								inputRef={register({ required: 'This field is required' })}
								onChange={(event) => {
									setoPassword(event.target.value);
								}}
								helperText={errors.opassword ? errors.opassword.message : 'Input Old Password'}
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
								label="Your New Password"
								name="npassword"
								defaultValue={npassword}
								error={errors.npassword}
								inputRef={register({ required: 'This field is required' })}
								onChange={(event) => {
									setnPassword(event.target.value);
								}}
								helperText={errors.npassword ? errors.npassword.message : 'Input New Password'}
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
									validate: (value) => value === npassword || 'The password do not match',
								})}
								onChange={(event) => {
									setcPassword(event.target.value);
								}}
								helperText={errors.cpassword ? errors.cpassword.message : 'Confirm Password'}
								variant="outlined"
							/>
						</FormControl>
					</Grid>
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
