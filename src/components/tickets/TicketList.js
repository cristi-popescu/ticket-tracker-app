import React from "react";
import TicketTable from "./TicketTable";

import { connect } from "react-redux";

import { sortTickets } from "../../actions/ticketActions";
import {
    selectSortedTickets,
    selectTicketStatuses,
    selectSortingRule
} from "../../selectors";

const TicketList = props => {
    const sortTicketsHandler = e => {
        const { sortTickets, sortingRule } = props;
        const { sortingKey, direction } = sortingRule;
        const { currentTarget } = e;
        const triggeredSortingKey = currentTarget.getAttribute("column");
        let triggeredDirection = "asc";

        if (triggeredSortingKey === sortingKey) {
            triggeredDirection = direction === "asc" ? "desc" : "asc";
        }

        sortTickets({
            sortingKey: triggeredSortingKey,
            direction: triggeredDirection
        });
    };

    const { tickets, ticketStatuses, sortingRule } = props;
    const tableColumns = {
        key: "Key",
        name: "Name",
        status: "Status",
        creationDate: "Creation Date",
        lastModified: "Last Modified"
    };
    const ticketTableProps = {
        tableColumns,
        sortingRule,
        sortTicketsHandler,
        tickets,
        ticketStatuses: ticketStatuses.byIds,
        enableSorting: true
    };

    return <TicketTable {...ticketTableProps}></TicketTable>;
};

const mapStateToProps = state => ({
    tickets: selectSortedTickets(state),
    ticketStatuses: selectTicketStatuses(state),
    sortingRule: selectSortingRule(state)
});

const mapDispatchToProps = {
    sortTickets
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketList);
