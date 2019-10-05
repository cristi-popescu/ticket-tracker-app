import React, { Component } from "react";
import TicketRow from "./TicketRow";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Table from "react-bootstrap/Table";

import {
    fetchTicketsPending,
    fetchTicketsSuccess,
    fetchTicketsError
} from "../actions/ticketActions";
import { selectTickets, selectTicketStatuses } from "../selectors";

class TicketList extends Component {
    constructor(props) {
        super(props);

        this.fetchTickets();

        this.sortTickets = this.sortTickets.bind(this);
    }

    fetchTickets() {
        const dispatch = this.props.dispatch;

        dispatch(fetchTicketsPending());

        const ticketsData = {
            tickets: {
                "1": {
                    id: "1",
                    number: "TCK-1",
                    name: "My First Ticket",
                    creationDate: "2019-10-04T18:00:00",
                    lastModified: "2019-10-04T21:00:00",
                    status: "2"
                },
                "2": {
                    id: "2",
                    number: "TCK-2",
                    name: "My Second Ticket",
                    creationDate: "2019-10-04T20:00:00",
                    lastModified: "2019-10-04T21:00:00",
                    status: "1"
                }
            },
            allIDs: ["1", "2"]
        };

        try {
            // TODO: Get Tickets Service Call
            dispatch(fetchTicketsSuccess(ticketsData));
        } catch (e) {
            dispatch(fetchTicketsError("Error loading tickets."));
        }
    }

    sortTickets() {
        //this.props.dispatch(sortTickets());
    }

    render() {
        const tickets = this.props.tickets;
        const ticketStatuses = this.props.ticketStatuses;
        const tableColumns = {
            id: "ID",
            name: "Name",
            status: "Status",
            creationDate: "Creation Date",
            lastModified: "Last Modified"
        };
        const tableHeaders = Object.keys(tableColumns).map(key => {
            return (
                <th key={key} onClick={this.sortTickets}>
                    {tableColumns[key]}
                </th>
            );
        });

        const ticketRows = tickets.map(ticket => {
            let status = ticketStatuses[ticket.status];
            let ticketProp = { ...ticket, status };

            return (
                <TicketRow
                    key={ticket.id}
                    ticket={ticketProp}
                    tableColumns={tableColumns}
                ></TicketRow>
            );
        });

        return (
            <Table hover variant="dark">
                <thead>
                    <tr>{tableHeaders}</tr>
                </thead>
                <tbody>{ticketRows}</tbody>
            </Table>
        );
    }
}

const mapStateToProps = state => ({
    tickets: selectTickets(state),
    ticketStatuses: selectTicketStatuses(state)
});

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
    mapStateToProps,
    mapDispatchToProps
)(TicketList);
