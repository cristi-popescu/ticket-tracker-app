import React from "react";

import { connect } from "react-redux";

import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

import TicketRow from "./TicketRow";

import { selectRequestStatus } from "../selectors";

const TicketTable = props => {
    const {
        tableColumns,
        enableSorting,
        sortingRule,
        sortTicketsHandler,
        tickets,
        ticketStatuses,
        requestStatus
    } = props;
    const { sortingKey, direction } = sortingRule ? sortingRule : {};
    const tableHeaderAttributes = {
        onClick: enableSorting && sortTicketsHandler
    };
    const tableRowAttributes = {
        sortingKey: enableSorting && sortingKey
    };

    const tableHeaders = Object.keys(tableColumns).map(key => {
        return (
            <th
                key={key}
                column={key}
                className={
                    enableSorting && sortingKey === key
                        ? "sorted sorted-" + direction
                        : ""
                }
                {...tableHeaderAttributes}
            >
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
                {...tableRowAttributes}
            ></TicketRow>
        );
    });

    return (
        <React.Fragment>
            {requestStatus.pending ? (
                <Spinner animation="border" />
            ) : requestStatus.error ? (
                <Alert variant="danger">{requestStatus.error}</Alert>
            ) : (
                <Table hover>
                    <thead>
                        <tr>{tableHeaders}</tr>
                    </thead>
                    <tbody>{ticketRows}</tbody>
                </Table>
            )}
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    requestStatus: selectRequestStatus(state)
});

export default connect(mapStateToProps)(TicketTable);
