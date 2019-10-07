import {
    FETCH_TICKETS_PENDING,
    FETCH_ALL_TICKETS_SUCCESS,
    FETCH_TICKET_SUCCESS,
    FETCH_TICKETS_ERROR,
    SORT_TICKETS,
    ADD_TICKET,
    EDIT_TICKET,
    SHOW_TICKET_MODAL,
    CLOSE_TICKET_MODAL,
    CHANGE_TICKET_STATUS
} from "./types";

export const fetchTicketsPending = () => {
    return {
        type: FETCH_TICKETS_PENDING
    };
};

export const fetchAllTicketsSuccess = data => {
    return {
        type: FETCH_ALL_TICKETS_SUCCESS,
        payload: data
    };
};

export const fetchTicketSuccess = data => {
    return {
        type: FETCH_TICKET_SUCCESS,
        payload: data
    };
};

export const fetchTicketsError = data => {
    return {
        type: FETCH_TICKETS_ERROR,
        payload: data
    };
};

export const sortTickets = data => {
    return {
        type: SORT_TICKETS,
        payload: data
    };
};

export const addTicket = data => {
    return {
        type: ADD_TICKET,
        payload: data
    };
};

export const editTicket = data => {
    return {
        type: EDIT_TICKET,
        payload: data
    };
};

export const showTicketModal = data => {
    return {
        type: SHOW_TICKET_MODAL,
        payload: data
    };
};

export const closeTicketModal = () => {
    return {
        type: CLOSE_TICKET_MODAL
    };
};

export const changeTicketStatus = data => {
    return {
        type: CHANGE_TICKET_STATUS,
        payload: data
    };
};
