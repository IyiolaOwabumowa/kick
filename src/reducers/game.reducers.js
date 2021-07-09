import { gameConstants } from "../constants/gameConstants";
import moment from "moment";
import { authConstants } from "../constants/authConstants";

const initialState = {
  categories: null,
  totalAnsweredQuestions: 1,
  progressivePoints: 0,
  kickLeaderboard: null,
  goalLeaderboard: null,
  kickLoading: true,
  goalLoading: true,
  lbLoading: true,
  payment: null,
  personalWins: null,
  bankRes: null,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case gameConstants.GET_CAT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case gameConstants.GET_CAT_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.categories,
      };

    case gameConstants.GET_CAT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case gameConstants.START_GAME_REQUEST:
      return {
        ...state,
        gameloading: true,
        gameObj: null,
      };

    case gameConstants.START_GAME_SUCCESS:
      return {
        ...state,
        gameloading: false,
        gameObj: action.gameObj,
      };

    case gameConstants.START_GAME_FAILURE:
      return {
        ...state,
        gameloading: false,
        gameObj: null,
        error: action.error,
      };

    case gameConstants.STOP_GAME_REQUEST:
      return {
        ...state,
        gameloading: true,
      };

    case gameConstants.STOP_GAME_SUCCESS:
      const startDate = moment(action.gameObj.game_sesssion.started_at);
      const endDate = moment(action.gameObj.game_sesssion.ended_at);
      var rawTimeSpent = moment.duration(endDate.diff(startDate));
      if (rawTimeSpent.minutes() == 0) {
        var timeSpent = `${rawTimeSpent.seconds()}.${rawTimeSpent.milliseconds()} seconds`;
      } else if (rawTimeSpent.minutes() == 1) {
        var timeSpent = `${rawTimeSpent.minutes()} minute ${rawTimeSpent.seconds()}.${rawTimeSpent.milliseconds()} seconds`;
      } else {
        var timeSpent = `${rawTimeSpent.minutes()} minutes ${rawTimeSpent.seconds()}.${rawTimeSpent.milliseconds()} seconds`;
      }

      return {
        ...state,
        gameloading: false,
        timeObject: {
          started_at: action.gameObj.game_sesssion.started_at,
          ended_at: action.gameObj.game_sesssion.ended_at,
          timeSpent: timeSpent,
        },
        points: action.gameObj.game_sesssion.points,
      };

    case gameConstants.STOP_GAME_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case gameConstants.GET_TQ:
      return {
        ...state,
        totalNumberOfQuestions: action.totalNumberOfQuestions,
      };

    case gameConstants.GET_AQ:
      return {
        ...state,
        totalAnsweredQuestions: action.totalAnsweredQuestions,
      };

    case gameConstants.INCREMENT_AQ:
      return {
        ...state,
        totalAnsweredQuestions: state.totalAnsweredQuestions + action.count,
      };

    case gameConstants.SUBMIT_REQUEST:
      return {
        ...state,
        loading: true,
        answerObj: action.answerObj,
      };

    case gameConstants.SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        answerObj: action.answerObj,
      };

    case gameConstants.SUBMIT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case gameConstants.GET_LEADERBOARD_REQUEST:
      if (action.cat == "kick") {
        return {
          ...state,
          loading: true,
          kickLoading: true,
          goalLoading: false,
          lbLoading: true,
        };
      } else if (action.cat == "goal") {
        return {
          ...state,
          loading: true,
          kickLoading: false,
          goalLoading: true,
          lbLoading: true,
        };
      } else {
        return {
          ...state,
          loading: true,
          kickLoading: true,
          goalLoading: true,
          lbLoading: true,
        };
      }

    case gameConstants.GET_LEADERBOARD_SUCCESS:
      if (action.title == "kick") {
        return {
          ...state,
          loading: false,
          kickLoading: false,
          lbLoading: state.kickLoading == true && state.goalLoading == true,
          kickLeaderboard: action.leaderboard,
          answerObj: null,
          timeObject: null,
        };
      } else {
        return {
          ...state,
          loading: false,
          goalLoading: false,
          lbLoading: state.kickLoading == true && state.goalLoading == true,
          goalLeaderboard: action.leaderboard,
        };
      }

    case gameConstants.GET_LEADERBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case gameConstants.CLEAR_PAYMENT:
      return {
        ...state,
        payment: null,
        bankRes: null,
      };

    case gameConstants.GET_BUNDLES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case gameConstants.GET_BUNDLES_SUCCESS:
      return {
        ...state,
        loading: false,
        bundles: action.bundles,
      };

    case gameConstants.GET_BUNDLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case gameConstants.BUY_KOINS_REQUEST:
      return {
        ...state,
        koinsLoading: true,
      };

    case gameConstants.BUY_KOINS_SUCCESS:
      return {
        ...state,
        koinsLoading: false,
        payment: action.payment,
      };

    case gameConstants.BUY_KOINS_FAILURE:
      return {
        ...state,
        koinsLoading: false,
        error: action.error,
      };

    case gameConstants.REGISTER_BANK_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case gameConstants.REGISTER_BANK_SUCCESS:
      return {
        ...state,
        loading: false,
        bankRes: action.bankRes,
      };

    case gameConstants.REGISTER_BANK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case gameConstants.GET_WINS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case gameConstants.GET_WINS_SUCCESS:
      return {
        ...state,
        loading: false,
        personalWins: action.wins,
      };

    case gameConstants.GET_WINS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case gameConstants.RESET_QA:
      return {
        ...state,
        totalAnsweredQuestions: 1,
        progressivePoints: 0,
        totalNumberOfQuestions: null,
        gameObj: null,
      };

    case gameConstants.ADD_POINTS:
      return {
        ...state,
        progressivePoints: state.progressivePoints + action.progressivePoints,
      };

    case gameConstants.CLEAR_ANSWER:
      return {
        ...state,
        answerObj: null,
      };

    case gameConstants.CLEAR_STATE:
      return {
        ...state,
        player: null,
        goalLeaderboard: null,
        kickLeaderboard: null,
      };

    default:
      return state;
  }
}
