import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login,
  getItem,
  saveItem,
  deleteItem,
  sendResetLink,
  signup, 
};

function signup(username, email, password) {
  const signupDetails = {
    username, email, password
  };
  return axios

    .post(
      "https://kickgameapp.herokuapp.com/api/v1/accounts/register",
      signupDetails
    )
    .then((response) => {
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      console.log(error.response)
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }
    });
}


function login(email, password) {
  const loginDetails = {
    email: email,
    password: password
  };

  return axios
    .post(
      "https://kickgameapp.herokuapp.com/api/v1/accounts/login",
      loginDetails
    )
    .then((response) => {
     
      const successObject = { status: response.status, data: response.data };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
       return successObject;
    })
    .catch(function (error) {
     // console.log(error.response)
      if (error.response) {
    
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }
    });
}

function sendResetLink(email) {
  const emailDetails = {email}
  return axios
    .post(
      `https://kickgameapp.herokuapp.com/api/v1/accounts/resetpassword`, emailDetails
    )
    .then((response) => {
      const successObject = { status: response.status };
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }
        return errorObject;
      }
    });
}


function getItem(itemName) {
  return AsyncStorage.getItem(itemName)
    .then((value) => {
      return value;
    })
    .catch((err) => {
      return err;
    });
}

function saveItem(itemName, itemValue) {
  return AsyncStorage.setItem(itemName, itemValue)
    .then((value) => {
      return value;
    })
    .catch((err) => {
      return err;
    });
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

// function logout() {
//   deleteData("@user");
// }

// const storeData = async data => {

//     await AsyncStorage.setItem("@user", data)

// };

// const deleteData= async data => {
//   try {
//     await AsyncStorage.removeItem(data);
//   } catch (error) {
//     // Error retrieving data
//     console.log(error.message);
//   }
// };
