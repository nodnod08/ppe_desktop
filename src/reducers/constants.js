export const INIT_DATA = {
  data: {
    APP_URL: 'http://localhost:5000',
    loading: false,
    alert: {
      message: '',
      type: '',
      isShow: false,
    },
    user: {
      error: false,
      token: '',
      user_credentials: {},
      isLoggedIn: false,
    },
    api: {
      rowsPerPage: 10,
      page: 1,
      data: [],
      total: 0,
    },
  },
};

//CONFIG
export const STOCK_SET_CONFIG = 'USER_CONFIG';
