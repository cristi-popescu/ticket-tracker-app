import { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    fetchTicketsPending,
    fetchAllTicketsSuccess,
    fetchTicketsError
} from "../actions/ticketActions";

class ServiceCall extends Component {
    async fetchTickets() {
        const { dispatch } = this.props;

        dispatch(fetchTicketsPending());

        try {
            const response = await fetch("http://localhost:3001/tickets");

            if (response.ok) {
                const tickets = await response.json();

                dispatch(fetchAllTicketsSuccess(tickets));
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
        return this.props.children;
    }
}

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators(
        {
            fetchTicketsPending,
            fetchAllTicketsSuccess,
            fetchTicketsError
        },
        dispatch
    )
});

export default connect(
    null,
    mapDispatchToProps
)(ServiceCall);
