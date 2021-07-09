import { gameConstants } from "../constants/gameConstants";
import { gameService } from "../services/game.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authConstants } from "../constants/authConstants";
import { authActions } from "./auth.actions";
export const gameActions = {
  getCategories,
  getKoinBundles,
  registerBank,
  buyKoins,
  getLeaderboard,
  startGame,
  stopGame,
  getQuestionLength,
  incrementAnsweredQuestions,
  getAnsweredQuestions,
  submitAnswer,
  addPoints,
  resetQA,
  clearPayment,
  clearAnswer,
  getWins,
  clearState,
};

function getCategories(token) {
  return (dispatch) => {
    dispatch(request());
    gameService
      .getCategories(token)
      .then((val) => {
        dispatch(success(val));
      })
      .catch((e) => {
        // console.log(e)
        // if (e.status == 401) {
        //   dispatch(authActions.deleteUserToken());
        // } else {
        //   dispatch(error(e));
        // }
      });
  };

  function request() {
    return { type: gameConstants.GET_CAT_REQUEST };
  }

  function success(categories) {
    return { type: gameConstants.GET_CAT_SUCCESS, categories };
  }

  function error(error) {
    return { type: gameConstants.GET_CAT_FAILURE, error };
  }
}

function getKoinBundles(token) {
  return (dispatch) => {
    dispatch(request());
    gameService
      .getKoinBundles(token)
      .then((bundles) => {
        dispatch(success(bundles));
      })
      .catch((e) => {
        dispatch(error(e));
      });
  };

  function request() {
    return { type: gameConstants.GET_BUNDLES_REQUEST };
  }

  function success(bundles) {
    return { type: gameConstants.GET_BUNDLES_SUCCESS, bundles };
  }

  function error(error) {
    return { type: gameConstants.GET_BUNDLES_FAILURE, error };
  }
}

function registerBank(token, bankName, accountNumber, bankCode) {
  return (dispatch) => {
    dispatch(request());
    gameService
      .registerBank(token, bankName, accountNumber, bankCode)
      .then((bankRes) => {
        // setTimeout(() => {
        //   dispatch(success(null));
        // }, 3000);
        if (bankRes.status == 200) {
          dispatch(success(bankRes));
        } else {
          dispatch(error(bankRes.error[0]));
        }
      })
      .catch((e) => {
        dispatch(error(e));
      });
  };

  function request() {
    return { type: gameConstants.REGISTER_BANK_REQUEST };
  }

  function success(bankRes) {
    return { type: gameConstants.REGISTER_BANK_SUCCESS, bankRes };
  }

  function error(error) {
    return { type: gameConstants.REGISTER_BANK_FAILURE, error };
  }
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
  return (dispatch) => {
    dispatch(request());
    gameService
      .buyKoins(
        token,
        cardNumber,
        cvv,
        amount,
        vendor,
        bundle,
        expiryMonth,
        expiryYear,
        email
      )

      .then((payment) => {
        // console.log(payment);
        if (payment.code) {
          dispatch(error(payment.message));
          setTimeout(() => {
            dispatch(error(null));
          }, 3000);
        } else if (payment.error) {
          dispatch(error(payment.error));
          setTimeout(() => {
            dispatch(error(null));
          }, 3000);
        } else {
          dispatch(success(payment));
        }
      })
      .catch((e) => {
        dispatch(error(e));
      });
  };

  function request() {
    return { type: gameConstants.BUY_KOINS_REQUEST };
  }

  function success(payment) {
    return { type: gameConstants.BUY_KOINS_SUCCESS, payment };
  }

  function error(error) {
    return { type: gameConstants.BUY_KOINS_FAILURE, error };
  }
}

function getWins(token, category) {
  return (dispatch) => {
    gameService
      .getPersonalWins(token)
      .then((wins) => {
        dispatch(winsSuccess(wins));
      })
      .catch((e) => {
        console.log(e);
        dispatch(winsError(e));
      });
  };

  function winsSuccess(wins) {
    return { type: gameConstants.GET_WINS_SUCCESS, wins };
  }

  function winsError(error) {
    return { type: gameConstants.GET_WINS_FAILURE, error };
  }
}

function getLeaderboard(token, category, cat) {
  return (dispatch) => {
    dispatch(request(cat));

    if (category.current_season != null) {
      gameService
        .getLeaderboard(token, category.current_season.id, category.id)
        .then((lb) => {
          dispatch(success(lb, category.title.toLowerCase()));
        })
        .catch((e) => {
          console.log(e);
          dispatch(error(e));
        });
    }
  };

  function request() {
    return { type: gameConstants.GET_LEADERBOARD_REQUEST, cat };
  }

  function success(leaderboard, title) {
    return { type: gameConstants.GET_LEADERBOARD_SUCCESS, leaderboard, title };
  }

  function error(error) {
    return { type: gameConstants.GET_LEADERBOARD_FAILURE, error };
  }
}

function startGame(token, categoryId, playerId, seasonId) {
  return (dispatch) => {
    dispatch(request());
    gameService
      .startGame(token, categoryId, playerId, seasonId)
      .then((val) => {
        if (val.status == 400) {
          dispatch(error(val.message));
        } else {
          dispatch(getQuestionLength(val));
          dispatch(success(val));
        }
      })
      .catch((e) => {
        dispatch(error(e));
      });
  };

  function request() {
    return { type: gameConstants.START_GAME_REQUEST };
  }

  function success(gameObj) {
    return { type: gameConstants.START_GAME_SUCCESS, gameObj };
  }

  function error(error) {
    return { type: gameConstants.START_GAME_FAILURE, error };
  }
}

function stopGame(gameplayId, token) {
  return (dispatch) => {
    dispatch(request());
    gameService
      .stopGame(gameplayId, token)
      .then((val) => {
        //   console.log(val);
        dispatch(success(val));
      })
      .catch((e) => {
        //  console.log(e);
        dispatch(error(e));
      });
  };

  function request() {
    return { type: gameConstants.STOP_GAME_REQUEST };
  }

  function success(gameObj) {
    return { type: gameConstants.STOP_GAME_SUCCESS, gameObj };
  }

  function error(error) {
    return { type: gameConstants.STOP_GAME_FAILURE, error };
  }
}

function submitAnswer(token, answer, gameplayId, questionId) {
  return (dispatch) => {
    dispatch(request());
    gameService
      .submitAnswer(token, answer, gameplayId, questionId)
      .then((val) => {
        dispatch(success(val.result));
      })
      .catch((e) => {
        dispatch(error(e));
      });
  };

  function request() {
    return {
      type: gameConstants.SUBMIT_REQUEST,
      answerObj: { readyForCheck: false },
    };
  }

  function success(answerObj) {
    return {
      type: gameConstants.SUBMIT_SUCCESS,
      answerObj: { ...answerObj, readyForCheck: true },
    };
  }

  function error(error) {
    return {
      type: gameConstants.SUBMIT_FAILURE,
      error,
    };
  }
}

function resetQA() {
  return (dispatch) => {
    dispatch(success());
  };

  function success() {
    return { type: gameConstants.RESET_QA };
  }
}

function getQuestionLength(go) {
  //console.log(go)
  return (dispatch) => {
    dispatch(success(gameService.getQuestionLength(go.questions)));
  };

  function success(totalNumberOfQuestions) {
    return { type: gameConstants.GET_TQ, totalNumberOfQuestions };
  }
}

function incrementAnsweredQuestions(count) {
  // console.log(go)
  return (dispatch) => {
    dispatch(success(count));
  };

  function success(count) {
    return { type: gameConstants.INCREMENT_AQ, count };
  }
}

function addPoints(points) {
  return (dispatch) => {
    dispatch(success(points));
  };

  function success(progressivePoints) {
    return { type: gameConstants.ADD_POINTS, progressivePoints };
  }
}

function getAnsweredQuestions() {
  // console.log(go)
  return (dispatch) => {
    dispatch(success());
  };

  function success() {
    return { type: gameConstants.GET_AQ };
  }
}

function clearPayment() {
  // console.log(go)
  return (dispatch) => {
    dispatch(success());
  };

  function success() {
    return { type: gameConstants.CLEAR_PAYMENT };
  }
}

function clearAnswer() {
  // console.log(go)
  return (dispatch) => {
    dispatch(success());
  };

  function success() {
    return { type: gameConstants.CLEAR_ANSWER };
  }
}

function clearState() {
  return {
    type: gameConstants.CLEAR_STATE,
  };
}
