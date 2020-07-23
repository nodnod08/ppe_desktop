import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
	root_container: {
		width: '100%',
	},
	root_formcontrol: {
		minWidth: 250,
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	ck: {
		margin: theme.spacing(1),
	},
}));
