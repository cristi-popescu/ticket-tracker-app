import React from "react";
import TicketTable from "./TicketTable";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { sortTickets } from "../../actions/ticketActions";
import {
    selectSortedTickets,
    selectTicketStatuses,
    selectSortingRule
} from "../../selectors";

const TicketList = props => {
    const sortTicketsHandler = e => {
        const { dispatch, sortingRule } = props;
        const { sortingKey, direction } = sortingRule;
        const { currentTarget } = e;
        const triggeredSortingKey = currentTarget.getAttribute("column");
        let triggeredDirection = "asc";

        if (triggeredSortingKey === sortingKey) {
            triggeredDirection = direction === "asc" ? "desc" : "asc";
        }

        dispatch(
            sortTickets({
                sortingKey: triggeredSortingKey,
                direction: triggeredDirection
            })
        );
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

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators(
        {
            sortTickets
        },
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketList);
