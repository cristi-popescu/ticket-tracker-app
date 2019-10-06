import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Logo from "../logo.svg";

import { showTicketAddModal } from "../actions/ticketActions";
import { selectShowTicketAddModal } from "../selectors";

const Header = props => {
    const handleClick = () => {
        const { dispatch } = props;

        dispatch(showTicketAddModal());
    };

    return (
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

            <Link to="/">Dashboard</Link>

            <Link to="/ticket-list">View All Tickets</Link>

            <Button variant="light" onClick={handleClick}>
                Create Ticket
            </Button>
        </Navbar>
    );
};

const mapStateToProps = state => ({
    showTicketAddModal: selectShowTicketAddModal(state)
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators({ showTicketAddModal }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
