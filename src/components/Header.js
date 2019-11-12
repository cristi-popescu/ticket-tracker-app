import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Logo from "../logo.svg";

import { showTicketModal } from "../actions/ticketActions";

export const Header = props => {
    const handleClick = () => {
        const { showTicketModal } = props;

        showTicketModal({});
    };

    return (
        <Router>
            <Navbar bg="dark" variant="dark">
                <Link to="/">
                    <Navbar.Brand>
                        <img
                            src={Logo}
                            width="50"
                            height="50"
                            className="d-inline-block align-middle"
                            alt="Ticket Tracker"
                        />
                        Ticket Tracker
                    </Navbar.Brand>
                </Link>

                <Link to="/" className="navbar-link">
                    Dashboard
                </Link>

                <Link to="/ticket-list" className="navbar-link">
                    View All Tickets
                </Link>

                <Button variant="light" onClick={handleClick}>
                    Create Ticket
                </Button>
            </Navbar>
        </Router>
    );
};

export default connect(
    null,
    { showTicketModal }
)(Header);
