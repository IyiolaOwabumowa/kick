import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FormData from "form-data";
import RNPaystack from "react-native-paystack";

export const gameService = {
  getCategories,
  getPersonalWins,
  getKoinBundles,
  registerBank,
  buyKoins,
  startGame,
  stopGame,
  getQuestionLength,
  submitAnswer,
  getLeaderboard,
};

function getCategories(token) {
  return axios
    .get(`https://kickgameapp.herokuapp.com/api/v1/games/categories`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // console.log(token)
      const successObject = response.data.results;
      // console.log(response)
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      //console.log(error)
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }
        throw errorObject;
      }
    });
}

function getKoinBundles(token) {
  return axios
    .get("https://kickgameapp.herokuapp.com/api/v1/coins/bundles/", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data.results;
    })
    .catch((error) => {
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        return errorObject;
      }
    });
}

function registerBank(token, bankName, accountNumber, bankCode) {
  const accountDetails = {
    bank_name: bankName,
    account_number: accountNumber,
    bank_code: bankCode,
  };

  return axios
    .post(
      "https://kickgameapp.herokuapp.com/api/v1/accounts/bankaccount",
      accountDetails,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = { status: error.response.status, error: values[0] };
        return errorObject;
      }
    });
}

function buyKoins(
  token,
  cardNumber,
  cvv,
  amount,
  vendor,
  bundle,
  expiryMonth,
  expiryYear,
  email
) {
  return RNPaystack.chargeCard({
    // cardNumber: `${cardNumber}`,
    // expiryMonth: `${expiryMonth}`,
    // expiryYear: `${expiryYear}`,
    // cvc: `${cvv}`,
    // email: `${email}`,
    // amountInKobo: amount * 100,

    cardNumber: "4123450131001381",
    expiryMonth: "10",
    expiryYear: "24",
    cvc: "883",
    email: "chargeIOS@master.dev",
    amountInKobo: amount * 100,
  })
    .then((response) => {
      const accountDetails = {
        vendor,
        amount,
        trans_reference: response.reference,
        //trans_reference: Math.random().toString(36).substring(7),
        bundle,
      };
      // console.log(accountDetails);
      return axios
        .post(
          "https://kickgameapp.herokuapp.com/api/v1/coins/buy/",
          accountDetails,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            const values = Object.values(error.response.data);
            const errorObject = {
              status: error.response.status,
              error: values[0],
            };
            return errorObject;
          }
        });
    })
    .catch((error) => {
      console.log(error);
      console.log(error.message);
      console.log(error.code);
      return error;
    });
}

function getLeaderboard(token, seasonId, categoryId) {
  // console.log(seasonId, categoryId)
  return axios
    .get(
      `https://kickgameapp.herokuapp.com/api/v1/winners/leaderboard/${seasonId}/${categoryId}/`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      const successObject = response.data.results;

      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      //   console.log(error);
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

function getPersonalWins(token) {
  // console.log(seasonId, categoryId)
  return axios
    .get(`https://kickgameapp.herokuapp.com/api/v1/winners/personnal/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const successObject = response.data.results;

      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      //   console.log(error);
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

function startGame(token, categoryId, playerId, seasonId) {
  const gameDetails = {
    category: categoryId,
    player: playerId,
    season: seasonId,
  };

  // console.log(token);
  //console.log(gameDetails);
  return axios
    .post(`https://kickgameapp.herokuapp.com/api/v1/games/start`, gameDetails, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const successObject = response.data;
      return successObject;
    })
    .catch(function (error) {
      //console.log(error.response.data);
      if (error.response) {
        const values = Object.values(error.response.data);
        const errorObject = {
          status: error.response.status,
          error: values[0],
          message: error.response.data.message,
        };

        return errorObject;
      }
    });
}

function stopGame(gameplayId, token) {
  return axios
    .get(`https://kickgameapp.herokuapp.com/api/v1/games/stop/${gameplayId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const successObject = response.data;
      // console.log(successObject)
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      //   console.log(error);
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

function submitAnswer(token, answer, gameplayId, questionId) {
  const gameDetails = {
    answer: answer,
    gameplay: gameplayId,
    question: questionId,
  };
  return axios
    .post(
      `https://kickgameapp.herokuapp.com/api/v1/games/answer`,
      gameDetails,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
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
        const errorObject = { status: error.response.status, error: values[0] };
        // for (const value of values) {
        //   console.log(value[0])
        // }
        return errorObject;
      }
    });
}

function getQuestionLength(questions) {
  //console.log(questions);
  const length = questions.length;
  const noOfQuestions = length;
  return noOfQuestions;
}
