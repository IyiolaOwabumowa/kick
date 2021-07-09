import { authConstants } from "../constants/authConstants";
import { authService } from "../services/auth.services";
import { userActions } from "../actions/user.actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authActions = {
  login,
  sendResetLink,
  signup,
  getUserToken,
  saveUserToken,
  deleteUserToken,
  clearErrors,
  clearState,
  resetRegistered,
};

function signup(username, email, password) {
  return (dispatch) => {
    dispatch(request());

    authService.signup(username, email, password).then((res) => {
      if (res.status == 200) {
        dispatch(
          success(true, `A confirmation link has been sent to ${email}`)
        );
      } else {
        dispatch(failure(res.error, false));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request() {
    return { type: authConstants.REGISTER_REQUEST };
  }
  function success(registered, msg) {
    return {
      type: authConstants.REGISTER_SUCCESS,
      registered,
      toastMessage: msg,
    };
  }
  function failure(error, registered) {
    return { type: authConstants.REGISTER_FAILURE, error: error, registered };
  }
}

function login(email, password) {
  return (dispatch) => {
    dispatch(request(email));

    authService.login(email, password).then((res) => {
      if (res.status == 200) {
        //console.log(res);

        dispatch(success(res.data.token, res.data.player.username));
        dispatch(userActions.savePlayer(res.data.player));
        dispatch(saveUserToken(res.data.token));
      } else {
        dispatch(failure(res.error));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request(user) {
    return { type: authConstants.LOGIN_REQUEST };
  }
  function success(token, username) {
    return { type: authConstants.LOGIN_SUCCESS, token, username };
  }
  function failure(error) {
    return { type: authConstants.LOGIN_FAILURE, error };
  }
  function saveToken() {
    return { type: authConstants.SAVE_TOKEN };
  }
}

function sendResetLink(email) {
  return (dispatch) => {
    dispatch(request(email));

    authService.sendResetLink(email).then((res) => {
      //  console.log(res);
      if (res.status && res.status == 200) {
        dispatch(success(`We've sent a reset link to your email`));
        setTimeout(() => {
          dispatch(success(null));
        }, 5000);
      } else {
        // console.log(res);
        dispatch(failure(res.error));
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request() {
    return { type: authConstants.RESET_LINK_REQUEST };
  }
  function success(msg) {
    return { type: authConstants.RESET_LINK_SUCCESS, resetMessage: msg };
  }
  function failure(error) {
    return { type: authConstants.RESET_LINK_FAILURE, error };
  }
}

function getUserToken() {
  return (dispatch) => {
    authService
      .getItem("token")
      .then((value) => {
        dispatch(getToken(value));
      })
      .catch((err) => {});
  };

  function getToken(token) {
    return { type: authConstants.GET_TOKEN, token };
  }
}

function saveUserToken(token) {
  return (dispatch) => {
    authService.saveItem("token", token).then((token) => {
      // dispatch(saveToken(token));
    });
  };

  function saveToken(token) {
    return { type: authConstants.SAVE_TOKEN, token };
  }
}

function deleteUserToken() {
  return (dispatch) => {
    authService.deleteItem("token").then((value) => {
      dispatch(deleteToken());
    });
  };

  function deleteToken() {
    return { type: authConstants.DELETE_TOKEN };
  }
}

function clearErrors() {
  return {
    type: authConstants.CLEAR_ERRORS,
  };
}

function clearState() {
  return {
    type: authConstants.CLEAR_STATE,
  };
}

function resetRegistered() {
  return {
    type: authConstants.RESET_REGISTERED,
  };
}
