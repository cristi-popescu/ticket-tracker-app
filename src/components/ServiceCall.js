import { Component } from "react";

import { connect } from "react-redux";

import { fetchAllTickets } from "../actions/ticketActions";

class ServiceCall extends Component {
    componentDidMount() {
        this.props.fetchAllTickets();
    }

    render() {
        return this.props.children;
    }
}

const mapDispatchToProps = {
    fetchAllTickets
};

export default connect(
    null,
    mapDispatchToProps
)(ServiceCall);
