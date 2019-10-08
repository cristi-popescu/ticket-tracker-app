import {
    FETCH_TICKETS_PENDING,
    FETCH_ALL_TICKETS_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET,
    EDIT_TICKET,
    SHOW_TICKET_MODAL,
    CLOSE_TICKET_MODAL,
    CHANGE_TICKET_STATUS,
    FETCH_TICKET_SUCCESS
} from "../actions/types";

const fetchTicketPending = (state, action) => {
    return {
        ...state,
        requestStatus: {
            ...state.requestStatus,
            pending: true
        }
    };
};

const fetchAllTicketsSuccess = (state, action) => {
    const tickets = action.payload;

    const byIds = tickets.reduce((acc, ticket) => {
        return {
            ...acc,
            [ticket.id]: ticket
        };
    }, {});

    const allIds = tickets.map(ticket => {
        return ticket.id;
    });

    return {
        ...state,
        items: {
            byIds,
            allIds
        },
        requestStatus: {
            ...state.requestStatus,
            pending: false
        }
    };
};

const fetchTicketSuccess = (state, action) => {
    const ticket = action.payload;
    const allIds = [...state.items.allIds];
    const { id } = ticket;

    if (allIds.indexOf(id) === -1) {
        allIds.push(id);
    }

    return {
        ...state,
        items: {
            byIds: {
                ...state.items.byIds,
                [ticket.id]: ticket
            },
            allIds: allIds
        },
        requestStatus: {
            ...state.requestStatus,
            pending: false
        }
    };
};

const fetchTicketsError = (state, action) => {
    return {
        ...state,
        requestStatus: {
            ...state.requestStatus,
            error: action.payload,
            pending: false
        }
    };
};

const sortTickets = (state, action) => {
    const { sortingKey, direction } = action.payload;

    return {
        ...state,
        sortingRule: {
            sortingKey,
            direction
        }
    };
};

const addTicket = (state, action) => {
    const { allIds } = state.items;
    const nextId = (parseInt(allIds[allIds.length - 1], 10) + 1).toString();

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
};

const editTicket = (state, action) => {
    const { id } = action.payload;

    return {
        ...state,
        items: {
            ...state.items,
            byIds: {
                ...state.items.byIds,
                [id]: {
                    ...state.items.byIds[id],
                    ...action.payload
                }
            }
        }
    };
};

const showTicketModal = (state, action) => {
    return {
        ...state,
        showTicketModal: {
            status: true,
            ...action.payload
        }
    };
};

const closeTicketModal = (state, action) => {
    return {
        ...state,
        showTicketModal: {
            status: false,
            editTicketKey: ""
        }
    };
};

const changeTicketStatus = (state, action) => {
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
};

const ticketReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_TICKETS_PENDING:
            return fetchTicketPending(state, action);
        case FETCH_ALL_TICKETS_SUCCESS:
            return fetchAllTicketsSuccess(state, action);
        case FETCH_TICKET_SUCCESS:
            return fetchTicketSuccess(state, action);
        case FETCH_TICKETS_ERROR:
            return fetchTicketsError(state, action);
        case SORT_TICKETS:
            return sortTickets(state, action);
        case ADD_TICKET:
            return addTicket(state, action);
        case EDIT_TICKET:
            return editTicket(state, action);
        case SHOW_TICKET_MODAL:
            return showTicketModal(state, action);
        case CLOSE_TICKET_MODAL:
            return closeTicketModal(state, action);
        case CHANGE_TICKET_STATUS:
            return changeTicketStatus(state, action);
        default:
            return state;
    }
};

export default ticketReducer;
