import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    fetchTicketsPending,
    fetchTicketsSuccess,
    fetchTicketsError
} from "./actions/ticketActions";

import "./App.css";
import Header from "./components/Header";
import Gadget from "./components/Gadget";
import TicketList from "./components/TicketList";
import TicketSave from "./components/TicketSave";
import TicketDetail from "./components/TicketDetail";

const App = props => {
    const fetchTickets = () => {
        const { dispatch } = props;

        dispatch(fetchTicketsPending());

        const ticketsData = {
            tickets: {
                "1": {
                    id: "1",
                    key: "TCK-1",
                    name: "My First Ticket",
                    description: "Lorem ipsum 1",
                    creationDate: "2019-10-04T18:00:00",
                    lastModified: "2019-10-04T22:00:00",
                    status: "2",
                    severity: "4"
                },
                "2": {
                    id: "2",
                    key: "TCK-2",
                    name: "My Second Ticket",
                    description: "Lorem ipsum 2",
                    creationDate: "2019-10-04T20:00:00",
                    lastModified: "2019-10-04T21:00:00",
                    status: "1",
                    severity: "5"
                },
                "3": {
                    id: "3",
                    key: "TCK-3",
                    name: "My Third Ticket",
                    description: "Lorem ipsum 3",
                    creationDate: "2019-10-04T20:00:00",
                    lastModified: "2019-10-04T21:00:00",
                    status: "1",
                    severity: "3"
                },
                "4": {
                    id: "4",
                    key: "TCK-4",
                    name: "My Fourth Ticket",
                    description: "Lorem ipsum 4",
                    creationDate: "2019-10-04T20:00:00",
                    lastModified: "2019-10-04T21:00:00",
                    status: "1",
                    severity: "2"
                },
                "5": {
                    id: "5",
                    key: "TCK-5",
                    name: "My Fifth Ticket",
                    description: "Lorem ipsum 5",
                    creationDate: "2019-10-04T20:00:00",
                    lastModified: "2019-10-04T21:00:00",
                    status: "1",
                    severity: "1"
                }
            },
            allIds: ["1", "2", "3", "4", "5"]
        };

        try {
            // TODO: Get Tickets Service Call
            dispatch(fetchTicketsSuccess(ticketsData));
        } catch (e) {
            dispatch(fetchTicketsError("Error loading tickets."));
        }
    };

    fetchTickets();

    return (
        <Router>
            <Header></Header>
            <Switch>
                <Route path="/ticket-list">
                    <h1>Tickets</h1>
                    <TicketList />
                </Route>
                <Route path="/ticket/:ticketKey" component={TicketDetail} />
                <Route path="/">
                    <h1>Dashboard</h1>
                    <div class="gadget-container">
                        <Gadget type="lastTicketsAdded" limit="5" />
                        <Gadget type="lastTicketsResolved" limit="5" />
                    </div>
                </Route>
            </Switch>
            <TicketSave />
        </Router>
    );
};

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators(
        {
            fetchTicketsPending,
            fetchTicketsSuccess,
            fetchTicketsError
        },
        dispatch
    )
});

export default connect(
    null,
    mapDispatchToProps
)(App);
