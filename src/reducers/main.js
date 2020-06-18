import { INIT_DATA } from './constants';

export default function (state = INIT_DATA, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        data: {
          ...state.data,
          [action.ref]: {
            ...state.data[action.ref],
            ...action.data,
          },
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            user: {},
            isLoggedIn: false,
            token: '',
            error: false,
          },
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        data: {
          ...state.data,
          loading: action.data,
        },
      };
    case 'SET_ALERT':
      return {
        ...state,
        data: {
          ...state.data,
          alert: {
            ...state.data.alert,
            ...action.data,
          },
        },
      };
    case 'SET_API':
      return {
        ...state,
        data: {
          ...state.data,
          api: {
            ...state.data.api,
            ...action.data,
          },
        },
      };
    case 'RELOAD':
      if (action.payload == null) {
        return {
          ...state,
          user: null,
          isLoggedIn: false,
          token: '',
        };
      }
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true,
        token: action.payload.token,
      };
    default:
      return {
        ...state,
      };
  }
}
