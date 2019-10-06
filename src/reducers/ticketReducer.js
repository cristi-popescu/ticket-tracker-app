import {
    FETCH_TICKETS_PENDING,
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET,
    SHOW_TICKET_ADD_MODAL,
    CLOSE_TICKET_ADD_MODAL
} from "../actions/types";

const ticketReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_TICKETS_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_TICKETS_SUCCESS:
            const { byIds, allIds } = action.payload;

            return {
                ...state,
                items: {
                    byIds,
                    allIds
                },
                pending: false
            };
        case FETCH_TICKETS_ERROR:
            return {
                ...state,
                error: action.error,
                pending: false
            };
        case SORT_TICKETS:
            const { sortingKey, direction } = action.payload;

            return {
                ...state,
                sortingRule: {
                    sortingKey,
                    direction
                }
            };
        case ADD_TICKET:
            const { byIds: stateByIds, allIds: stateAllIds } = state.items;
            const nextId = (
                parseInt(stateAllIds[stateAllIds.length - 1], 10) + 1
            ).toString();

            stateAllIds.push(nextId);
            stateByIds[nextId] = { id: nextId, ...action.payload };

            return {
                ...state,
                lastAddedTicketKey: action.payload.key
            };
        case SHOW_TICKET_ADD_MODAL:
            return {
                ...state,
                showTicketAddModal: true
            };
        case CLOSE_TICKET_ADD_MODAL:
            return {
                ...state,
                showTicketAddModal: false
            };
        default:
            return state;
    }
};

export default ticketReducer;
