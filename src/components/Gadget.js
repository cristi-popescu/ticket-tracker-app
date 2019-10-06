import React from "react";
import TicketRow from "./TicketRow";

import { connect } from "react-redux";

import Table from "react-bootstrap/Table";

import { selectGadgetTickets, selectTicketStatuses } from "../selectors";

const Gadget = props => {
    const { tickets, ticketStatuses, type, limit } = props;
    const gadgetConfig = {
        lastTicketsAdded: {
            tableColumns: {
                key: "Key",
                name: "Name",
                status: "Status",
                creationDate: "Creation Date"
            }
        },
        lastTicketsResolved: {
            tableColumns: {
                key: "Key",
                name: "Name",
                status: "Status",
                lastModified: "Last Modified"
            }
        }
    };
    const { tableColumns } = gadgetConfig[type];
    const tableHeaders = Object.keys(tableColumns).map(key => {
        return <th key={key}>{tableColumns[key]}</th>;
    });
    const ticketRows = tickets[type](limit).map(ticket => {
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
        <Table hover>
            <thead>
                <tr>{tableHeaders}</tr>
            </thead>
            <tbody>{ticketRows}</tbody>
        </Table>
    );
};

const mapStateToProps = state => ({
    tickets: selectGadgetTickets(state),
    ticketStatuses: selectTicketStatuses(state)
});

export default connect(mapStateToProps)(Gadget);
