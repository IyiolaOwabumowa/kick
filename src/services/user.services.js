import AsyncStorage from "@react-native-async-storage/async-storage";
import userActions from "../actions/user.actions";
import axios from "axios";
import FormData from "form-data";

export const userService = {
  refreshPlayer,
  getItem,
  saveItem,
  deleteItem,
  updateProfile,
  updateDp,
};

function refreshPlayer(token, id) {
  return axios
    .get(`https://kickgameapp.herokuapp.com/api/v1/accounts/user/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // console.log(response);
      const successObject = response.data;
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      // console.log(error);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        // const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }
        return errorObject;
      }
    });
}

async function updateProfile(
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
  // console.log(
  //   email,
  //   username,
  //   phone,
  //   // image,
  //   dp_id,
  //   id,
  //   token,
  //   old_password,
  //   new_password
  // );

  const userDetails = {
    email,
    username,
    phone,
  };

  //  console.log(userDetails);

  try {
    const response = await axios.patch(
      `https://kickgameapp.herokuapp.com/api/v1/accounts/user/${id}`,
      userDetails,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const successObject = { status: response.status, data: response.data };

    //  const token = res.data.token;
    //  const id = 1;
    //  const auth = {id, token}
    //  return auth;

    const dpRes = await updateDp(image, dp_id, token);

    if (old_password && new_password) {
      if (old_password.length > 1 || new_password.length > 1) {
        const passObject = await changePassword(
          id,
          token,
          old_password,
          new_password
        );

        // console.log(dpRes);
        if (dpRes.status == 200 && passObject.status == 200) {
          return successObject;
        } else {
          return { status: 400, error: passObject.error };
        }
      }
    }

    return successObject;
  } catch (error) {
    // console.log(error);
    if (error.response) {
      // Request made and server responded
      const values = Object.values(error.response.data);
      const errorObject = {
        status: error.response.status,
        error: error.response.data.message,
      };
      // for (const value of values) {
      //   console.log(value[0])
      // }
      return errorObject;
    }

    Promise.reject(error);
  }
}

function updateDp(file, id, token) {
  const data = new FormData();

  const uri = file;

  let uriParts = uri.split(".");

  let fileType = uriParts[uriParts.length - 1].slice(0, 3);

  data.append("display_picture", {
    uri,
    type: `image/${fileType}`,
    name: `${Math.random().toString(36).substring(7)}image.${fileType}`,
  });

  return axios
    .put(
      `https://kickgameapp.herokuapp.com/api/v1/accounts/profile/${id}`,
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      // console.log(successObject);
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;

      return successObject;
    })
    .catch((error) => {
      if (error.response) {
        // console.log(error.response.data);
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = {
          status: error.response.status,
          error: "Oops, something went wrong!",
        };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }

      Promise.reject(error);
    });
}

function changePassword(id, token, old_password, new_password) {
  const data = {
    old_password,
    new_password,
  };

  //  console.log(data);
  //console.log(data._parts[0])

  return axios
    .put(
      `https://kickgameapp.herokuapp.com/api/v1/accounts/changepassword`,
      data,
      {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      //  console.log(successObject);
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;

      return successObject;
    })
    .catch((error) => {
      //console.log(error);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = {
          status: error.response.status,
          error: error.response.data.message,
        };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }

      Promise.reject(error);
    });
}

async function getItem(itemName) {
  try {
    const retrievedItem = await AsyncStorage.getItem(itemName);

    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    //console.log(error.message);
  }
}

async function saveItem(itemName, itemValue) {
  try {
    var jsonOfItem = await AsyncStorage.setItem(
      itemName,
      JSON.stringify(itemValue)
    );
    return itemValue;
  } catch (error) {
    return error;
  }
}

function deleteItem(itemName) {
  return AsyncStorage.removeItem(itemName)
    .then(() => {
      const success = "Delete Successful";
      return success;
    })
    .catch((err) => {
      return err;
    });
}
