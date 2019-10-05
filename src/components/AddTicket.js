import React, { Component } from "react";
import { connect } from "react-redux";
import { addTicket } from "../actions/ticketActions";

class AddTicket extends Component {
    render() {
        return <div></div>;
    }
}

export default connect(
    null,
    { addTicket }
)(AddTicket);
