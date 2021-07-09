import { combineReducers } from 'redux'
import authReducer from "./auth.reducers.js"
import userReducer from "./user.reducers.js"
import gameReducer from "./game.reducers.js"



export default combineReducers({
   authReducer, userReducer, gameReducer
  })