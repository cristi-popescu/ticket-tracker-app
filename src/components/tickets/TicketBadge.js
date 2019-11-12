import React from "react";
import Badge from "react-bootstrap/Badge";

import badges from "../../configs/badges";

const TicketBadge = props => {
    const { value } = props;

    return <Badge variant={badges[value]}>{value}</Badge>;
};

export default TicketBadge;
