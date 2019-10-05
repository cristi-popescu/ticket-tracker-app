import { combineReducers } from "redux";
import ticketReducer from "./ticketReducer";
import ticketStatusesReducer from "./ticketStatusesReducer";
import sortingRuleReducer from "./sortingRuleReducer";

export default combineReducers({
    tickets: ticketReducer,
    ticketStatuses: ticketStatusesReducer,
    sortingRule: sortingRuleReducer
});
