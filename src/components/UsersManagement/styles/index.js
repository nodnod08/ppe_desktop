import { makeStyles, lighten } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
	root_container: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	paper: {
		padding: 1,
	},
	root_formcontrol: {
		width: '100%',
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	ck: {
		margin: theme.spacing(1),
	},
	fab: {
		position: 'absolute',
		top: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

export const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.primary.main,
					backgroundColor: lighten(theme.palette.primary.light, 0.85),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: {
		flex: '1 1 100%',
	},
}));
