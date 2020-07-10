import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	FormControl,
	MenuItem,
	TextField,
	Container,
	Grid,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
} from '@material-ui/core';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import Confirm from './../../reusable/Confirm';
import useToggle from './../../reusable/useToggle';
import CustomAlert from './../../reusable/Alert';
import { ProgressSending } from './../../reusable/Progress';
import { useStyles } from './../styles';
import { setLoading, setAlert } from './../../../actions/actions';

const InsertItems = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, alert, loading, user } = data;
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState({});
	const [brands, setBrands] = useState([]);
	const [brand, setBrand] = useState({});
	const [files, setFiles] = useState([]);
	const [content, setContent] = useState('<p>Input Data for this product</p>');
	const [item_name, setName] = useState('');
	const [sellable, setSellable] = useState(false);
	const [price, setPrice] = useState(1000);
	const [stocks, setStocks] = useState(1);
	const [confirm, setConfirm] = useToggle(false);

	useEffect(() => {
		axios.get(`${APP_URL}/api-item-categories/get-categories`).then((res) => {
			setCategories(res.data.data);
		});
	}, []);

	useEffect(() => {
		if (Object.keys(category).length) {
			axios
				.get(`${APP_URL}/api-item-categories/get-brands/${JSON.stringify(category)}`)
				.then((res) => {
					setBrands(res.data.data);
				});
		}
	}, [category]);

	const addItem = () => {
		dispatch(setLoading(true));
		const formData = new FormData();
		formData.append('file', files[0].file);
		if (sellable) {
			formData.append('price', price);
		}
		formData.append('brand', JSON.stringify(brand));
		formData.append('stocks', stocks);
		formData.append('content', content);
		formData.append('category', JSON.stringify(category));
		formData.append('item_name', item_name);
		formData.append('added_by', JSON.stringify(user.user_credentials));
		const config = {
			headers: {
				enctype: 'multipart/form-data',
			},
		};
		axios.post(`${APP_URL}/api-items/add-item`, formData, config).then((res) => {
			dispatch(setLoading(false));
			dispatch(setAlert({ isShow: true, type: res.data.result, message: res.data.message }));
		});
	};

	return (
		<Container>
			<Confirm
				message="Do you want to save it now?"
				onClose={setConfirm}
				onSuccess={addItem}
				open={confirm}
			/>
			<Grid item xs={12}>
				<FormControl component="fieldset" className={classes.root_formcontrol}>
					<RadioGroup
						name="sellable"
						value={sellable}
						onChange={() => {
							setSellable(!sellable);
						}}
					>
						<FormControlLabel value={true} control={<Radio />} label="Sellable" />
						<FormControlLabel value={false} control={<Radio />} label="Rental" />
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<FormControl className={classes.root_formcontrol}>
					<TextField
						required
						size="small"
						label="Item Name"
						value={item_name || ''}
						onChange={(event) => {
							setName(event.target.value);
						}}
						helperText="Input Item Name please"
						variant="outlined"
					/>
				</FormControl>
				<FormControl className={classes.root_formcontrol}>
					<TextField
						type="number"
						required
						size="small"
						label="Stocks"
						value={stocks || 0}
						onChange={(event) => {
							setStocks(event.target.value);
						}}
						helperText="Input Item Stocks please"
						variant="outlined"
					/>
				</FormControl>
				{sellable ? (
					<FormControl className={classes.root_formcontrol}>
						<TextField
							size="small"
							label="Item Price"
							value={price || ''}
							onChange={(event) => {
								setPrice(event.target.value);
							}}
							helperText="Input Item Price please"
							variant="outlined"
						/>
					</FormControl>
				) : null}
				<FormControl className={classes.root_formcontrol}>
					{categories.length ? (
						<TextField
							required
							select
							size="small"
							label="Categories"
							value={category || {}}
							onChange={(event) => {
								setCategory(event.target.value);
							}}
							helperText="Please select your category"
							variant="outlined"
						>
							{categories.map((option) => (
								<MenuItem key={option._id} value={option}>
									{option.category_name}
								</MenuItem>
							))}
						</TextField>
					) : null}
				</FormControl>
				<FormControl className={classes.root_formcontrol}>
					{brands.length ? (
						<TextField
							required
							select
							size="small"
							label="Brands"
							value={brand || {}}
							onChange={(event) => {
								setBrand(event.target.value);
							}}
							helperText="Please select your Brand"
							variant="outlined"
						>
							{brands.map((option) => (
								<MenuItem key={option._id} value={option}>
									{option.brand_name} - {option.is_colored ? 'COLORED' : 'MONOCHROME'}
								</MenuItem>
							))}
						</TextField>
					) : null}
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<FormControl className={classes.root_formcontrol}>
					<small>Recommended size is 300px by 300px</small>
					<FilePond
						allowMultiple={false}
						maxFiles={1}
						onupdatefiles={(fileItems) => {
							setFiles(fileItems);
						}}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<FormControl className={classes.root_formcontrol}>
					<CKEditor
						data="<p>Input Data for this product</p>"
						onChange={(evt) => {
							setContent(evt.editor.getData());
						}}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<FormControl className={classes.root_formcontrol}>
					<Button size="small" variant="contained" color="primary" onClick={setConfirm}>
						Add Item
					</Button>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				{loading && <ProgressSending />}
				{alert.isShow && <CustomAlert type={alert.type} message={alert.message} />}
			</Grid>
		</Container>
	);
};

export default InsertItems;
