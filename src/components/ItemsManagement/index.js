import React from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import InsertItems from './InsertItems';
import ItemsList from './ItemsList';
import { useStyles } from './styles';

const ExpansionPanel = withStyles({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		boxShadow: 'none',
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			margin: 'auto',
		},
	},
	expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
	root: {
		backgroundColor: 'rgba(0, 0, 0, .03)',
		borderBottom: '1px solid rgba(0, 0, 0, .125)',
		marginBottom: -1,
		minHeight: 56,
		'&$expanded': {
			minHeight: 56,
		},
	},
	content: {
		'&$expanded': {
			margin: '12px 0',
		},
	},
	expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiExpansionPanelDetails);

const ItemsManagement = () => {
	const classes = useStyles();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, loading } = data;
	const [expanded, setExpanded] = React.useState('panel1');

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<div className={classes.root_container}>
			<ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
				<ExpansionPanelSummary
					aria-controls="panel1d-content"
					id="panel1d-header"
					expandIcon={<ExpandMoreIcon />}
				>
					<Typography>Insert Items</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<InsertItems type="new" />
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
				<ExpansionPanelSummary
					aria-controls="panel2d-content"
					id="panel2d-header"
					expandIcon={<ExpandMoreIcon />}
				>
					<Typography>Items List</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>{expanded == 'panel2' ? <ItemsList /> : null}</ExpansionPanelDetails>
			</ExpansionPanel>
		</div>
	);
};

export default ItemsManagement;
