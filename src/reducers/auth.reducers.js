import { authConstants } from "../constants/authConstants";
import { authActions } from "../actions/auth.actions";

const initialState = {
  token: null,
  toastMessage: null,
  registered: false,
  lbLoading: true,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        token: null,
        loggingIn: true,
        lbLoading: true,
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        lbLoading: true,
        token: action.token,
        username: action.username,
      };

    case authConstants.LOGIN_FAILURE:
      return {
        loggingIn: false,
        loginError: action.error,
        token: null,
        lbLoading: true,
      };
    case authConstants.REGISTER_REQUEST:
      return {
        registering: true,
        registered: false,
      };
    case authConstants.REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        registered: action.registered,
        toastMessage: action.toastMessage,
      };
    case authConstants.REGISTER_FAILURE:
      return {
        registering: false,
        errorMessage: action.error,
        registered: action.registered,
      };

    case authConstants.RESET_REGISTERED:
      return {
        ...state,
        registered: false,
      };

    case authConstants.RESET_LINK_REQUEST:
      return {
        sendingReq: true,
      };
    case authConstants.RESET_LINK_SUCCESS:
      return {
        sendingReq: false,
        resetMessage: action.resetMessage,
      };
    case authConstants.RESET_LINK_FAILURE:
      return {
        sendingReq: false,
        resetError: action.error,
      };
    case authConstants.CLEAR_ERRORS:
      return {
        ...state,
        errorMessage: null,
      };

    case authConstants.GET_TOKEN:
      return {
        ...state,
        token: action.token,
      };

    case authConstants.SAVE_TOKEN:
      return {
        ...state,
        token: action.token,
      };

    case authConstants.DELETE_TOKEN:
      return {
        token: null,
      };
    case authConstants.LOGOUT:
      return {
        loginErrorMessage: "",
        token: null,
      };

    case authConstants.CLEAR_STATE:
      return {};

    default:
      return state;
  }
}
