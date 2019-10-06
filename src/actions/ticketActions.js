import {
    FETCH_TICKETS_PENDING,
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET,
    SHOW_TICKET_ADD_MODAL,
    CLOSE_TICKET_ADD_MODAL
} from "./types";

export const fetchTicketsPending = () => {
    return {
        type: FETCH_TICKETS_PENDING
    };
};

export const fetchTicketsSuccess = data => {
    return {
        type: FETCH_TICKETS_SUCCESS,
        payload: {
            byIds: data.tickets,
            allIds: data.allIds
        }
    };
};

export const fetchTicketsError = error => {
    return {
        type: FETCH_TICKETS_ERROR,
        error: error
    };
};

export const sortTickets = data => {
    return {
        type: SORT_TICKETS,
        payload: data
    };
};

export const addTicket = data => {
    // TODO: Add Ticket Service Call

    return {
        type: ADD_TICKET,
        payload: {
            creationDate: new Date(),
            lastModified: new Date(),
            status: "1",
            ...data
        }
    };
};

export const showTicketAddModal = () => {
    return {
        type: SHOW_TICKET_ADD_MODAL
    };
};

export const closeTicketAddModal = () => {
    return {
        type: CLOSE_TICKET_ADD_MODAL
    };
};
