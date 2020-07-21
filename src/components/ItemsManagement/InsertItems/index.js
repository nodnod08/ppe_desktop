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
	Paper,
	RadioGroup,
	FormControlLabel,
} from '@material-ui/core';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

import Confirm from './../../reusable/Confirm';
import useToggle from './../../reusable/useToggle';
import CustomAlert from './../../reusable/Alert';
import { ProgressSending } from './../../reusable/Progress';
import { useStyles } from './../styles';
import { setLoading, setAlert, setApi } from './../../../actions/actions';

const InsertItems = ({ type, value }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.main);
	const { APP_URL, alert, loading, user, api } = data;
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState(type == 'update' ? value.onModel : '');
	const [brands, setBrands] = useState([]);
	const [brand, setBrand] = useState(type == 'update' ? value.brand._id : '');
	const [files, setFiles] = useState([]);
	const [content, setContent] = useState(
		type == 'update' ? value.content : '<p>Input Data for this product</p>'
	);
	const [item_name, setName] = useState(type == 'update' ? value.item_name : '');
	const [sellable, setSellable] = useState(
		type == 'update' ? (value.hasOwnProperty('price') ? true : false) : false
	);
	const [price, setPrice] = useState(
		type == 'update' ? (value.hasOwnProperty('price') ? value.price : 1000) : 1000
	);
	const [stocks, setStocks] = useState(type == 'update' ? value.stocks : 1);
	const [confirm, setConfirm] = useToggle(false);
	const { register, handleSubmit, errors, control } = useForm({ mode: 'all' });

	const onSubmit = () => {
		if (!Object.keys(errors).length) {
			setConfirm();
		}
	};
	useEffect(() => {
		axios.get(`${APP_URL}/api-item-categories/get-categories`).then((res) => {
			setCategories(res.data.data);
			if (type != 'update') {
				setCategory(res.data.data[0].model_name);
			}
		});
	}, []);

	useEffect(() => {
		if (Object.keys(category).length) {
			axios.get(`${APP_URL}/api-item-categories/get-brands/${category}`).then((res) => {
				setBrands(res.data.data);
				if (type != 'update') {
					setBrand(res.data.data[0]._id);
				}
			});
		}
	}, [category]);

	const accelerate = async () => {
		dispatch(setLoading(true));
		const formData = new FormData();
		if (files.length == 0) {
			formData.append('file', null);
		} else {
			formData.append('file', files[0].file);
		}
		if (sellable) {
			formData.append('price', price);
		}
		formData.append('brand', JSON.stringify(brand));
		formData.append('stocks', stocks);
		formData.append('content', content);
		formData.append('category', JSON.stringify(category));
		formData.append('item_name', item_name);
		if (type == 'update') {
			formData.append('old_data', JSON.stringify(value));
			formData.append('type', 'update');
		} else {
			formData.append('type', 'create');
		}
		formData.append('added_by', JSON.stringify(user.user_credentials));
		const config = {
			headers: {
				enctype: 'multipart/form-data',
			},
		};

		axios.post(`${APP_URL}/api-items/update-create`, formData, config).then(async (res) => {
			let new_data = [...api.data];
			new_data.push(res.data.added);
			dispatch(setApi({ data: new_data, total: api.total + 1 }));
			dispatch(setLoading(false));
			dispatch(setAlert({ isShow: true, type: res.data.result, message: res.data.message }));
		});
	};

	return (
		<Paper variant="outlined" square>
			<Confirm
				message={
					type == 'update'
						? 'Do you really want to overwrite this item?'
						: 'Do you really want to save it now?'
				}
				onClose={setConfirm}
				onSuccess={accelerate}
				open={confirm}
			/>
			{type == 'update' && (
				<Grid item xs={12}>
					<img
						src={`http://localhost:5000/storage/${value.photo_name}`}
						width="100px"
						height="100px"
						alt=""
					/>
				</Grid>
			)}
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
						size="small"
						label="Item Name"
						name="item_name"
						defaultValue={item_name}
						error={errors.item_name}
						inputRef={register({ required: true })}
						// value={item_name}
						onChange={(event) => {
							setName(event.target.value);
						}}
						helperText={errors.item_name ? 'This field is required' : 'Input Item Name please'}
						variant="outlined"
					/>
				</FormControl>
				<FormControl className={classes.root_formcontrol}>
					<TextField
						type="number"
						required
						size="small"
						name="stocks"
						defaultValue={stocks}
						error={errors.stocks}
						inputRef={register({ required: true })}
						label="Stocks"
						// value={stocks || 0}
						onChange={(event) => {
							setStocks(event.target.value);
						}}
						helperText={errors.stocks ? 'This field is required' : 'Input Item Stocks please'}
						variant="outlined"
					/>
				</FormControl>
				{sellable ? (
					<FormControl className={classes.root_formcontrol}>
						<TextField
							type="number"
							size="small"
							label="Item Price"
							defaultValue={price}
							name="price"
							error={errors.price}
							inputRef={register({ required: true })}
							// value={price || ''}
							onChange={(event) => {
								setPrice(event.target.value);
							}}
							helperText={errors.price ? 'This field is required' : 'Input Item Price please'}
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
							name="category"
							label="Categories"
							// error={errors.category}
							// inputRef={register({ required: true })}
							value={category || {}}
							onChange={(event) => {
								setCategory(event.target.value);
								console.log(category);
							}}
							variant="outlined"
						>
							{categories.map((option) => (
								<MenuItem key={option._id} value={option.model_name}>
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
							name="brand"
							label="Brands"
							value={brand || {}}
							onChange={(event) => {
								setBrand(event.target.value);
							}}
							variant="outlined"
						>
							{brands.map((option) => (
								<MenuItem key={option._id} value={option._id}>
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
						data={content}
						onChange={(evt) => {
							setContent(evt.editor.getData());
						}}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				{type == 'update' ? (
					<FormControl className={classes.root_formcontrol}>
						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={handleSubmit(onSubmit)}
						>
							Update Item
						</Button>
					</FormControl>
				) : (
					<FormControl className={classes.root_formcontrol}>
						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={handleSubmit(onSubmit)}
						>
							Add Item
						</Button>
					</FormControl>
				)}
			</Grid>
			<Grid item xs={12}>
				{loading && <ProgressSending />}
				{alert.isShow && <CustomAlert type={alert.type} message={alert.message} />}
			</Grid>
		</Paper>
	);
};

export default InsertItems;
