import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ListGroup from "react-bootstrap/ListGroup";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";

import TicketBadge from "./TicketBadge";
import TicketDate from "./TicketDate";

import { changeTicketStatus, showTicketModal } from "../actions/ticketActions";

import {
    selectTicketByKey,
    selectTicketStatuses,
    selectTicketSeverities,
    selectShowTicketModal
} from "../selectors";

class TicketDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statusChangeButton: this.getStatusChangeButton()
        };

        this.getStatusChangeButtonConfig = this.getStatusChangeButtonConfig.bind(
            this
        );
        this.getStatusChangeButton = this.getStatusChangeButton.bind(this);
        this.getTicket = this.getTicket.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        const currentTicketModalStatus = this.props.ticketModal.status;
        const prevTicketModalStatus = prevProps.ticketModal.status;

        if (currentTicketModalStatus !== prevTicketModalStatus) {
            this.setState({
                statusChangeButton: this.getStatusChangeButton()
            });
        }
    }

    getStatusChangeButtonConfig() {
        return {
            1: {
                text: "Resolve",
                action: "Resolve",
                newStatus: 2
            },
            2: {
                text: "Re-Open",
                action: "Re-Open",
                newStatus: 1
            }
        };
    }

    getStatusChangeButton() {
        const ticket = this.getTicket();
        const { status } = ticket;

        return this.getStatusChangeButtonConfig()[status];
    }

    getTicket() {
        const { match, getTicketByKey } = this.props;
        const { ticketKey } = match.params;

        return getTicketByKey(ticketKey);
    }

    editHandler() {
        const { dispatch, match } = this.props;
        const { ticketKey } = match.params;

        dispatch(
            showTicketModal({
                editTicketKey: ticketKey
            })
        );
    }

    statusChangeHandler() {
        const { statusChangeButton } = this.state;
        const { newStatus } = statusChangeButton;
        const { dispatch } = this.props;
        const ticket = this.getTicket();

        dispatch(
            changeTicketStatus({
                id: ticket.id,
                newStatus: statusChangeButton.newStatus
            })
        );

        this.setState({
            statusChangeButton: this.getStatusChangeButtonConfig()[newStatus]
        });
    }

    render() {
        const ticket = this.getTicket();
        const { ticketStatuses, ticketSeverities } = this.props;
        const { statusChangeButton } = this.state;
        const { status } = ticket;

        return (
            <React.Fragment>
                <h1>{ticket.name}</h1>
                <Button
                    className="ticket-detail-button"
                    variant="dark"
                    onClick={this.editHandler}
                >
                    Edit
                </Button>
                <Button
                    className="ticket-detail-button"
                    variant="dark"
                    action={statusChangeButton.action}
                    onClick={this.statusChangeHandler}
                >
                    {statusChangeButton.text}
                </Button>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <b>Status:</b>{" "}
                        <TicketBadge value={ticketStatuses.byIds[status]} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <b>Severity:</b>{" "}
                        <TicketBadge
                            value={ticketSeverities.byIds[ticket.severity]}
                        />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <b>Creation Date:</b>{" "}
                        <TicketDate value={ticket.creationDate} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <b>Last Modified:</b>{" "}
                        <TicketDate value={ticket.lastModified} />
                    </ListGroup.Item>
                </ListGroup>
                <Toast className="ticket-detail-toast">
                    <Toast.Header closeButton={false}>
                        <h2>Description</h2>
                    </Toast.Header>
                    <Toast.Body>
                        <p>{ticket.description}</p>
                    </Toast.Body>
                </Toast>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    getTicketByKey: selectTicketByKey(state),
    ticketStatuses: selectTicketStatuses(state),
    ticketSeverities: selectTicketSeverities(state),
    ticketModal: selectShowTicketModal(state)
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators({ changeTicketStatus, showTicketModal }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketDetail);
