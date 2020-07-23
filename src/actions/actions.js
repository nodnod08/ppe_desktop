import axios from 'axios';

export const login = (userCredentials, ref) => (dispatch) => {
	dispatch({
		type: 'LOGIN',
		data: userCredentials,
		ref,
	});
};

export const reload = (data) => (dispatch) => {
	const payloads = localStorage.getItem('authenticatedSE');
	if (payloads == null || payloads == '') {
		dispatch({
			type: 'RELOAD',
			payload: null,
		});
	} else {
		axios
			.post('http://localhost:3000/user/checkJWT', {
				payloads,
			})
			.then((response) => {
				if (response.data.result.message == 'jwt expired' && !response.data.result.validUser) {
					localStorage.removeItem('authenticatedSE');
				}
				return response;
			})
			.then((response) => {
				dispatch({
					type: 'RELOAD',
					payload:
						response.data.result.message == 'jwt not expired' && response.data.result.validUser
							? JSON.parse(payloads)
							: null,
				});
			});
	}
};

export const logout = (data) => (dispatch) => {
	dispatch({
		type: 'LOGOUT',
	});
};

export const setLoading = (loading) => (dispatch) => {
	dispatch({
		type: 'SET_LOADING',
		data: loading,
	});
};

export const setAlert = (alert) => (dispatch) => {
	dispatch({
		type: 'SET_ALERT',
		data: alert,
	});
};

export const setApi = (config, location) => (dispatch) => {
	dispatch({
		type: 'SET_API',
		data: config,
		location,
	});
};

export const refresh_user_token = () => (dispatch) => {
	let user_cache = localStorage.getItem('ppe_desktop_user');
	if (typeof user_cache != 'undefined') {
		user_cache =
			typeof user_cache == 'string'
				? JSON.parse(localStorage.getItem('ppe_desktop_user'))
				: localStorage.getItem('ppe_desktop_user');
		dispatch({
			type: 'LOGIN',
			data: user_cache,
			ref: 'user',
		});
	}
};

export const fetchData = (url, location) => (dispatch) => {
	axios
		.get(url)
		.then((res) => {
			dispatch(
				setApi(
					{
						total: res.data.total,
						data: res.data.data,
					},
					location
				)
			);
		})
		.then(() => {
			dispatch(setLoading(false));
		});
};

export const deleteItem = (url, url2, data, api, location) => (dispatch) => {
	dispatch(setLoading(true));
	axios
		.post(url, {
			onModel: data.onModel,
			id: data.brand._id,
			idToDelete: data._id,
			photo: data.photo_name,
		})
		.then(() => {
			axios
				.get(url2)
				.then((res) => {
					dispatch(
						setApi(
							{
								page:
									api.total % api.rowsPerPage == 1
										? api.page > 1
											? api.page - 1
											: api.page
										: api.page,
								total: res.data.total,
								data: res.data.data,
							},
							location
						)
					);
				})
				.then(() => {
					dispatch(setLoading(false));
				});
		});
};
