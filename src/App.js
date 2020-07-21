import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Tooltip, Tab, Tabs, Paper, Typography, Box, IconButton } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ViewListIcon from '@material-ui/icons/ViewList';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableViews from 'react-swipeable-views';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import Login from './components/login';
import { refresh_user_token } from './actions/actions';
import Account from './components/account';
import InsertItems from './components/ItemsManagement/InsertItems';
import ItemLists from './components/ItemsManagement/ItemsList';

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		maxWidth: '100%',
		minHeight: 600,
	},
});

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<React.Fragment>{children}</React.Fragment>
				</Box>
			)}
		</div>
	);
};

const App = ({ user }) => {
	const classes = useStyles();
	const theme = useTheme();
	const [value, setValue] = useState(0);
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState([
		'Users Management',
		'Insert Items',
		'Item Lists',
		'Charts View',
		'General Settings',
	]);
	const [components, setComponents] = useState([
		'Users Management',
		<InsertItems type="create" />,
		<ItemLists />,
		'Charts View',
		'General Settings',
	]);
	const [icon, setIcons] = useState([
		<GroupIcon />,
		<NoteAddIcon />,
		<ViewListIcon />,
		<ShowChartIcon />,
		<SettingsIcon />,
	]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	const handleToggle = () => {
		setOpen(!open);
	};

	return (
		<Paper square className={classes.root}>
			<Tooltip title="Account" aria-label="Account">
				<IconButton onClick={handleToggle} aria-label="Account">
					<MenuIcon />
				</IconButton>
			</Tooltip>
			<Account user={user} open={open} handleToggle={handleToggle} />
			<Tabs
				value={value}
				onChange={handleChange}
				variant="fullWidth"
				indicatorColor="primary"
				textColor="primary"
				aria-label="icon tabs example"
			>
				{categories.map((value, i) => (
					<Tab
						key={i}
						icon={
							<Tooltip title={value} placement="bottom">
								{icon[i]}
							</Tooltip>
						}
						aria-label="phone"
					/>
				))}
			</Tabs>
			<SwipeableViews
				axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
				index={value}
				onChangeIndex={handleChangeIndex}
			>
				{components.map((value, i) => (
					<TabPanel key={i} value={i} index={i} dir={theme.direction}>
						{value}
					</TabPanel>
				))}
			</SwipeableViews>
		</Paper>
	);
};

const Index = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(refresh_user_token());
	}, []);

	let user_session = localStorage.getItem('ppe_user_credentials');
	const { data } = useSelector((state) => state.main);
	const { user } = data;

	return <React.Fragment>{user.isLoggedIn ? <App user={user} /> : <Login />}</React.Fragment>;
};

export default Index;
