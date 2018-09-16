import { combineReducers } from "redux";
import {
    USER_INFO,
} from "../actions/action";

function userReducer(state = {}, action) {
    switch (action.type) {
        case USER_INFO:
            return {
                ...state,
                UserInfo: action.UserInfo,
            };
        default:
            return state;
    }
}

module.exports = combineReducers({
    user: userReducer,
});
