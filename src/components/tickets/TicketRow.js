import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import TicketBadge from "./TicketBadge";
import TicketDate from "./TicketDate";

class TicketRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToTicket: false
        };

        this.displayValue = this.displayValue.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    displayValue(key, value) {
        const dateColumns = ["creationDate", "lastModified"];
        const badgeColumns = ["status"];
        const boldColumns = ["key"];

        if (dateColumns.indexOf(key) > -1) {
            return <TicketDate value={value} />;
        }

        if (badgeColumns.indexOf(key) > -1) {
            return <TicketBadge value={value} />;
        }

        if (boldColumns.indexOf(key) > -1) {
            return <b>{value}</b>;
        }

        return value;
    }

    clickHandler() {
        this.setState({
            redirectToTicket: true
        });
    }

    render() {
        const { ticket, tableColumns, sortingKey } = this.props;

        if (this.state.redirectToTicket === true) {
            return <Redirect to={"/ticket/" + ticket.key} />;
        }

        const tableCells = Object.keys(tableColumns).map(key => {
            return (
                <td key={key} className={sortingKey === key ? "sorted" : ""}>
                    {this.displayValue(key, ticket[key])}
                </td>
            );
        });

        return <tr onClick={this.clickHandler}>{tableCells}</tr>;
    }
}

export default TicketRow;
