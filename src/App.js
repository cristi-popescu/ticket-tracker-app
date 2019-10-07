import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import ServiceCall from "./components/ServiceCall";
import Header from "./components/Header";
import Gadget from "./components/Gadget";
import TicketList from "./components/tickets/TicketList";
import TicketModal from "./components/tickets/TicketModal";
import TicketDetail from "./components/tickets/TicketDetail";

const App = () => {
    return (
        <Router>
            <Header></Header>
            <Switch>
                <Route path="/ticket-list">
                    <h1>Tickets</h1>
                    <ServiceCall type="getTickets">
                        <TicketList />
                    </ServiceCall>
                </Route>
                <Route path="/ticket/:ticketKey" component={TicketDetail} />
                <Route path="/">
                    <h1>Dashboard</h1>
                    <div className="gadget-container">
                        <ServiceCall type="getTickets">
                            <Gadget type="lastTicketsAdded" limit="5" />
                            <Gadget type="lastTicketsResolved" limit="5" />
                        </ServiceCall>
                    </div>
                </Route>
            </Switch>
            <TicketModal />
        </Router>
    );
};

export default App;
