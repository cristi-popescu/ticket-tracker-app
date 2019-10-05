import React from "react";
import "./App.css";
import TicketList from "./components/TicketList";

function App() {
    return (
        <React.Fragment>
            <h1>Dashboard</h1>
            <TicketList></TicketList>
        </React.Fragment>
    );
}

export default App;
