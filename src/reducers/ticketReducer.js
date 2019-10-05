import {
    FETCH_TICKETS_PENDING,
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET
} from "../actions/types";

const ticketReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_TICKETS_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_TICKETS_SUCCESS:
            return {
                ...state,
                byIDs: action.payload.byIDs,
                allIDs: action.payload.allIDs,
                pending: false
            };
        case FETCH_TICKETS_ERROR:
            return {
                ...state,
                error: action.error,
                pending: false
            };
        case SORT_TICKETS:
            return {
                ...state
            };
        case ADD_TICKET:
            return {
                ...state,
                ticket: action.payload
            };
        default:
            return state;
    }
};

export default ticketReducer;
