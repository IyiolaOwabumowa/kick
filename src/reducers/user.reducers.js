import { userConstants } from "../constants/userConstants";

const initialState = {
  player: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_PLAYER:
      return {
        ...state,
        player: action.player,
      };

    case userConstants.SAVE_PLAYER:
      return {
        ...state,
        player: action.player,
      };

    case userConstants.DELETE_PLAYER:
      return {
        ...state,
        player: null,
      };

    case userConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updating: true,
      };
    case userConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        toastMessage: action.toastMessage,
        updating: false,
      };
    case userConstants.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        error: action.error,
        updating: false,
      };

    case userConstants.REFRESH_PLAYER_REQUEST:
      return {
        ...state,
        playerLoading: true,
      };
    case userConstants.REFRESH_PLAYER_SUCCESS:
      return {
        ...state,
        playerLoading: false,
        player: action.player,
      };
    case userConstants.REFRESH_PLAYER_FAILURE:
      return {
        ...state,
        error: action.error,
        playerLoading: false,
      };

    case userConstants.UPDATE_DP_REQUEST:
      return {
        ...state,
        error: null,
      };

    case userConstants.UPDATE_DP_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case userConstants.UPDATE_DP_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case userConstants.CLEAR_STATE:
      return {
        ...state,
        player: null,
      };

    case userConstants.CLEAR_TOAST:
      return {
        ...state,
        toastMessage: null,
      };
    default:
      return state;
  }
}
