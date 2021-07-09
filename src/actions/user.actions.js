import { userConstants } from "../constants/userConstants";
import { userService } from "../services/user.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authConstants } from "../constants/authConstants";
export const userActions = {
  getPlayer,
  refreshPlayer,
  savePlayer,
  deletePlayer,
  updateProfile,
  clearToastMessage,
  updateDp,
  clearState,
};

function updateProfile(
  email,
  username,
  phone,
  image,
  dp_id,
  id,
  token,
  old_password,
  new_password
) {
  return (dispatch) => {
    dispatch(request());

    userService
      .updateProfile(
        email,
        username,
        phone,
        image,
        dp_id,
        id,
        token,
        old_password,
        new_password
      )
      .then((res) => {
        if (res.status == 200) {
          dispatch(savePlayer(res.data));
          dispatch(success(`Your profile was updated successfully`));
        } else {
          dispatch(failure(res.error));
          setTimeout(() => {
            dispatch(failure(null));
          }, 400000);
        }
      });
  };

  function request() {
    return { type: userConstants.UPDATE_PROFILE_REQUEST, loading: true };
  }
  function success(msg) {
    return { type: userConstants.UPDATE_PROFILE_SUCCESS, toastMessage: msg };
  }
  function failure(error) {
    return { type: userConstants.UPDATE_PROFILE_FAILURE, error: error };
  }
}

function updateDp(file, id) {
  return (dispatch) => {
    dispatch(request());

    userService.updateDp(file, id).then((res) => {
      if (res.status == 200) {
        dispatch(success());
      } else {
        dispatch(failure(res.error));
      }
    });
  };

  function request() {
    return { type: userConstants.UPDATE_DP_REQUEST };
  }
  function success() {
    return { type: userConstants.UPDATE_DP_SUCCESS };
  }
  function failure(error) {
    return { type: userConstants.UPDATE_DP_FAILURE, error };
  }
}

function getPlayer() {
  return (dispatch) => {
    userService
      .getItem("player")
      .then((val) => {
        dispatch(getPlayer(val));
      })
      .catch((e) => {
        dispatch(deleteToken());
      });
  };

  function getPlayer(player) {
    return { type: userConstants.GET_PLAYER, player };
  }

  function deleteToken() {
    return { type: authConstants.DELETE_TOKEN };
  }
}

function refreshPlayer(token, id) {
  return (dispatch) => {
    dispatch(request());
    userService
      .refreshPlayer(token, id)
      .then((val) => {
        dispatch(success(val));
      })
      .catch((e) => {
        dispatch(failure(e));
      });
  };

  function request() {
    return { type: userConstants.REFRESH_PLAYER_REQUEST };
  }
  function success(player) {
    return { type: userConstants.REFRESH_PLAYER_SUCCESS, player };
  }
  function failure(error) {
    return { type: userConstants.REFRESH_PLAYER_FAILURE, error };
  }
}

function savePlayer(player) {
  return (dispatch) => {
    userService
      .saveItem("player", player)
      .then((player) => {
        // console.log(player);
        dispatch(savePlayer(player));
      })
      .catch((e) => {
        //  console.log(e);
      });
  };

  function savePlayer(player) {
    return { type: userConstants.SAVE_PLAYER, player };
  }
}

function deletePlayer() {
  return (dispatch) => {
    userService.deleteItem("player").then((value) => {
      dispatch(deletePlayer());
    });
  };

  function deletePlayer() {
    return { type: userConstants.DELETE_PLAYER };
  }
}

function clearToastMessage() {
  return {
    type: userConstants.CLEAR_TOAST,
  };
}

function clearState() {
  return {
    type: userConstants.CLEAR_STATE,
  };
}
