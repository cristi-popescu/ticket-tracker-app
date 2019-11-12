import {
    FETCH_TICKETS_PENDING,
    FETCH_ALL_TICKETS_SUCCESS,
    FETCH_TICKET_SUCCESS,
    UPDATE_TICKET_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    CREATE_TICKET_SUCCESS,
    SHOW_TICKET_MODAL,
    CLOSE_TICKET_MODAL
} from "../actions/types";
import initialState from "../configs/initialState";
import createReducer from "./createReducer";

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

    console.dir(tickets);

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

const createTicketSuccess = (state, action) => {
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

const updateTicketSuccess = (state, action) => {
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
        },
        requestStatus: {
            ...state.requestStatus,
            pending: false
        }
    };
};

const handlers = {
    [FETCH_TICKETS_PENDING]: fetchTicketPending,
    [FETCH_ALL_TICKETS_SUCCESS]: fetchAllTicketsSuccess,
    [FETCH_TICKET_SUCCESS]: fetchTicketSuccess,
    [UPDATE_TICKET_SUCCESS]: updateTicketSuccess,
    [FETCH_TICKETS_ERROR]: fetchTicketsError,
    [SORT_TICKETS]: sortTickets,
    [CREATE_TICKET_SUCCESS]: createTicketSuccess,
    [SHOW_TICKET_MODAL]: showTicketModal,
    [CLOSE_TICKET_MODAL]: closeTicketModal
};

const ticketReducer = createReducer(initialState, handlers);

export default ticketReducer;
