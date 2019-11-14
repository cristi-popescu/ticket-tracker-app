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
} from "./types";

export const fetchAllTickets = () => {
  return dispatch => {
    dispatch(fetchTicketsPending());

    return fetch("http://localhost:3001/tickets")
      .then(
        response => response.json(),
        () => dispatch(fetchTicketsError("Error loading tickets"))
      )
      .then(response => {
        if (response && response.type !== FETCH_TICKETS_ERROR) {
          dispatch(fetchAllTicketsSuccess(response));
        }
      });
  };
};

export const fetchTicket = ticketKey => {
  return dispatch => {
    dispatch(fetchTicketsPending());

    return fetch("http://localhost:3001/tickets?key=" + ticketKey)
      .then(
        response => response.json(),
        () => dispatch(fetchTicketsError("Error loading ticket."))
      )
      .then(ticket => dispatch(fetchTicketSuccess(ticket[0])));
  };
};

export const createTicket = body => {
  return dispatch => {
    return fetch("http://localhost:3001/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(() => dispatch(createTicketSuccess(body)));
  };
};

export const updateTicket = (id, body) => {
  return dispatch => {
    dispatch(fetchTicketsPending());

    return fetch("http://localhost:3001/tickets/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(() => {
      dispatch(updateTicketSuccess({ id, ...body }));
      dispatch(closeTicketModal());
    });
  };
};

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

export const createTicketSuccess = data => {
  return {
    type: CREATE_TICKET_SUCCESS,
    payload: data
  };
};

export const updateTicketSuccess = data => {
  return {
    type: UPDATE_TICKET_SUCCESS,
    payload: data
  };
};
