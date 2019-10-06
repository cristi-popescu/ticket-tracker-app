import React, { Component } from "react";
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
import TicketModal from "./components/TicketModal";
import TicketDetail from "./components/TicketDetail";

class App extends Component {
    async fetchTickets() {
        const { dispatch } = this.props;

        dispatch(fetchTicketsPending());

        try {
            const response = await fetch("http://localhost:3001/tickets");

            if (response.ok) {
                const tickets = await response.json();

                dispatch(fetchTicketsSuccess(tickets));
            } else {
                throw new Error();
            }
        } catch (e) {
            dispatch(fetchTicketsError("Error loading tickets."));
        }
    }

    componentDidMount() {
        this.fetchTickets();
    }

    render() {
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
                        <div className="gadget-container">
                            <Gadget type="lastTicketsAdded" limit="5" />
                            <Gadget type="lastTicketsResolved" limit="5" />
                        </div>
                    </Route>
                </Switch>
                <TicketModal />
            </Router>
        );
    }
}

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
