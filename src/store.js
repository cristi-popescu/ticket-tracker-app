import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {
    tickets: {
        byIDs: {},
        allIDs: [],
        pending: false,
        error: ""
    },
    sortingRule: {
        sortingKey: "lastModified",
        direction: "desc"
    },
    ticketStatuses: {
        1: "Open",
        2: "Resolved"
    }
};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;
