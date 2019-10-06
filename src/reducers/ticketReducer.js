import {
    FETCH_TICKETS_PENDING,
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET,
    EDIT_TICKET,
    SHOW_TICKET_MODAL,
    CLOSE_TICKET_MODAL,
    CHANGE_TICKET_STATUS
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
            const { allIds: addTicketAllIds } = state.items;
            const nextId = (
                parseInt(addTicketAllIds[addTicketAllIds.length - 1], 10) + 1
            ).toString();

            return {
                ...state,
                items: {
                    ...state.items,
                    byIds: {
                        ...state.items.byIds,
                        [nextId]: {
                            id: nextId,
                            ...action.payload
                        }
                    },
                    allIds: [...state.items.allIds, nextId]
                },
                lastAddedTicketKey: action.payload.key
            };
        case EDIT_TICKET:
            const { id: editTicketId } = action.payload;

            return {
                ...state,
                items: {
                    ...state.items,
                    byIds: {
                        ...state.items.byIds,
                        [editTicketId]: {
                            ...state.items.byIds[editTicketId],
                            ...action.payload
                        }
                    }
                }
            };
        case SHOW_TICKET_MODAL:
            return {
                ...state,
                showTicketModal: {
                    status: true,
                    ...action.payload
                }
            };
        case CLOSE_TICKET_MODAL:
            return {
                ...state,
                showTicketModal: {
                    status: false,
                    editTicketKey: ""
                }
            };
        case CHANGE_TICKET_STATUS:
            const { id, newStatus, lastModified } = action.payload;

            return {
                ...state,
                items: {
                    ...state.items,
                    byIds: {
                        ...state.items.byIds,
                        [id]: {
                            ...state.items.byIds[id],
                            status: newStatus.toString(),
                            lastModified
                        }
                    }
                }
            };
        default:
            return state;
    }
};

export default ticketReducer;
