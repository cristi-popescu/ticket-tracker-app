import React from "react";
import TicketRow from "./TicketRow";

import Table from "react-bootstrap/Table";

const TicketTable = props => {
    const {
        tableColumns,
        enableSorting,
        sortingRule,
        sortTicketsHandler,
        tickets,
        ticketStatuses
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
        <Table hover>
            <thead>
                <tr>{tableHeaders}</tr>
            </thead>
            <tbody>{ticketRows}</tbody>
        </Table>
    );
};

export default TicketTable;
