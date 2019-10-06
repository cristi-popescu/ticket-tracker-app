import React from "react";

const TicketRow = props => {
    const formatDate = date => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            hour12: false,
            minute: "numeric",
            second: "numeric"
        };
        const formattedDate = new Date(date);

        if (!isNaN(formattedDate.getTime())) {
            return formattedDate.toLocaleDateString("en-EN", options);
        } else {
            return "N/A";
        }
    };

    const displayValue = (key, value) => {
        const dateColumns = ["creationDate", "lastModified"];

        return dateColumns.indexOf(key) === -1 ? value : formatDate(value);
    };

    const { ticket } = props;
    const { tableColumns, sortingKey } = props;
    const tableCells = Object.keys(tableColumns).map(key => {
        return (
            <td key={key} className={sortingKey === key ? "sorted" : ""}>
                {displayValue(key, ticket[key])}
            </td>
        );
    });

    return <tr>{tableCells}</tr>;
};

export default TicketRow;
