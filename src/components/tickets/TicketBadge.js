import React from "react";
import Badge from "react-bootstrap/Badge";

const TicketBadge = props => {
    const badgeVariants = {
        Open: "primary",
        Resolved: "success",
        Trivial: "light",
        Minor: "secondary",
        Major: "warning",
        Critical: "danger",
        Blocker: "danger"
    };
    const { value } = props;

    return <Badge variant={badgeVariants[value]}>{value}</Badge>;
};

export default TicketBadge;
