import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import InsertItems from './../InsertItems';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditFile({ value, open, setOpen }) {
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, api } = data;
	return (
		<div>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={setOpen}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">Edit {value.item_name}</DialogTitle>
				<DialogContent>
					<InsertItems type="update" value={value} />
				</DialogContent>
				<DialogActions>
					<Button onClick={setOpen} color="primary">
						Cancel
					</Button>
					{/* <Button color="primary">Save</Button> */}
				</DialogActions>
			</Dialog>
		</div>
	);
}
