import {
    FETCH_TICKETS_PENDING,
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET
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
            byIDs: data.tickets,
            allIDs: data.allIDs
        }
    };
};

export const fetchTicketsError = error => {
    return {
        type: FETCH_TICKETS_ERROR,
        error: error
    };
};

export const sortTickets = () => {
    return {
        type: SORT_TICKETS
    };
};

export const addTicket = data => {
    // TODO: Add Ticket Service Call

    return {
        type: ADD_TICKET,
        payload: {
            id: data.id,
            number: data.number,
            name: data.name,
            creationDate: data.creationDate,
            lastModified: data.lastModified,
            status: data.status
        }
    };
};
