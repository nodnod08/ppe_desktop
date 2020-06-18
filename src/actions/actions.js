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

export const setApi = (config) => (dispatch) => {
  dispatch({
    type: 'SET_API',
    data: config,
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

export const fetchData = (url) => (dispatch) => {
  axios.get(url).then((res) => {
    dispatch(
      setApi({
        total: res.data.total,
        data: res.data.data,
      })
    );
  });
};

export const deleteItem = (url, id) => (dispatch) => {
  axios.post(url, { id }).then((res) => {
    dispatch(
      setApi({
        total: res.data.total,
        data: res.data.data,
      })
    );
  });
};
