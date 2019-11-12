import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import * as actions from "./ticketActions";
import * as types from "./types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("async actions", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const mockResponse = {
    tickets: [
      {
        status: "1",
        severity: "3",
        name: "Ticket 1",
        description: "Lorem ipsum 1",
        lastModified: "2019-11-09T15:56:11.623Z",
        key: "TCK-1",
        creationDate: "2019-10-07T20:40:53.003Z",
        id: "kXsAeFG"
      },
      {
        status: "2",
        severity: "1",
        name: "Ticket 2",
        description: "Lorem ipsum 2",
        lastModified: "2019-11-09T15:56:23.036Z",
        key: "TCK-2",
        creationDate: "2019-10-07T20:48:15.464Z",
        id: "N6ElbOJ"
      }
    ]
  };

  test("creates a pending and a success action when fetching all tickets has been successful", () => {
    fetchMock.getOnce("http://localhost:3001/tickets", {
      headers: { "content-type": "application/json" },
      body: mockResponse
    });

    const expectedActions = [
      { type: types.FETCH_TICKETS_PENDING },
      { type: types.FETCH_ALL_TICKETS_SUCCESS, payload: mockResponse }
    ];
    const store = mockStore({});

    return store.dispatch(actions.fetchAllTickets()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test("creates a pending and an error action when fetching all tickets has failed", () => {
    fetchMock.getOnce("http://localhost:3001/tickets", {
      headers: { "content-type": "application/json" },
      body: mockResponse,
      throws: new Error("service error")
    });

    const expectedActions = [
      { type: types.FETCH_TICKETS_PENDING },
      { type: types.FETCH_TICKETS_ERROR, payload: "Error loading tickets." }
    ];
    const store = mockStore({});

    return store.dispatch(actions.fetchAllTickets()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe("actions", () => {
  test("creates an action to set pending status", () => {
    const expectedAction = {
      type: types.FETCH_TICKETS_PENDING
    };

    expect(actions.fetchTicketsPending()).toEqual(expectedAction);
  });

  test("creates an action to fetch all tickets", () => {
    const data = [
      {
        status: "1",
        severity: "3",
        name: "Ticket 1",
        description: "Lorem ipsum 1",
        lastModified: "2019-11-09T15:56:11.623Z",
        key: "TCK-1",
        creationDate: "2019-10-07T20:40:53.003Z",
        id: "kXsAeFG"
      },
      {
        status: "2",
        severity: "1",
        name: "Ticket 2",
        description: "Lorem ipsum 2",
        lastModified: "2019-11-09T15:56:23.036Z",
        key: "TCK-2",
        creationDate: "2019-10-07T20:48:15.464Z",
        id: "N6ElbOJ"
      }
    ];
    const expectedAction = {
      type: types.FETCH_ALL_TICKETS_SUCCESS,
      payload: data
    };

    expect(actions.fetchAllTicketsSuccess(data)).toEqual(expectedAction);
  });
});
