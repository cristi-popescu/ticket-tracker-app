import React from "react";
import TicketTable from "./tickets/TicketTable";

import Toast from "react-bootstrap/Toast";

import { connect } from "react-redux";

import { selectGadgetTickets, selectTicketStatuses } from "../selectors";

const Gadget = props => {
    const { tickets, ticketStatuses, type, limit } = props;
    const gadgetConfig = {
        lastTicketsAdded: {
            title: "Recently Added Tickets",
            tableColumns: {
                key: "Key",
                name: "Name",
                status: "Status",
                creationDate: "Creation Date"
            }
        },
        lastTicketsResolved: {
            title: "Recently Resolved Tickets",
            tableColumns: {
                key: "Key",
                name: "Name",
                status: "Status",
                lastModified: "Last Modified"
            }
        }
    };
    const gadgetType = gadgetConfig[type];
    const ticketTableProps = {
        tableColumns: gadgetType.tableColumns,
        tickets: tickets[type](limit),
        ticketStatuses: ticketStatuses.byIds
    };

    return (
        <Toast className="gadget-toast">
            <Toast.Header closeButton={false}>
                <h2>{gadgetType.title}</h2>
            </Toast.Header>
            <Toast.Body>
                <TicketTable {...ticketTableProps}></TicketTable>
            </Toast.Body>
        </Toast>
    );
};

const mapStateToProps = state => ({
    tickets: selectGadgetTickets(state),
    ticketStatuses: selectTicketStatuses(state)
});

export default connect(mapStateToProps)(Gadget);
