import React, { Component } from "react";
import TicketRow from "./TicketRow";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Table from "react-bootstrap/Table";

import { sortTickets } from "../actions/ticketActions";
import {
    selectSortedTickets,
    selectTicketStatuses,
    selectSortingRule
} from "../selectors";

class TicketList extends Component {
    constructor(props) {
        super(props);

        this.sortTickets = this.sortTickets.bind(this);
    }

    sortTickets(e) {
        const { sortingKey, direction } = this.props.sortingRule;
        const { currentTarget } = e;
        const triggeredSortingKey = currentTarget.getAttribute("column");
        let triggeredDirection = "asc";

        if (triggeredSortingKey === sortingKey) {
            triggeredDirection = direction === "asc" ? "desc" : "asc";
        }

        this.props.dispatch(
            sortTickets({
                sortingKey: triggeredSortingKey,
                direction: triggeredDirection
            })
        );
    }

    render() {
        const { tickets, ticketStatuses, sortingRule } = this.props;
        const { sortingKey, direction } = sortingRule;
        const tableColumns = {
            key: "Key",
            name: "Name",
            status: "Status",
            creationDate: "Creation Date",
            lastModified: "Last Modified"
        };
        const tableHeaders = Object.keys(tableColumns).map(key => {
            return (
                <th
                    key={key}
                    onClick={this.sortTickets}
                    column={key}
                    className={
                        sortingKey === key ? "sorted sorted-" + direction : ""
                    }
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
                    sortingKey={sortingKey}
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
    }
}

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
