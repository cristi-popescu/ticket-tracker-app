import React, { PureComponent } from "react";

import { connect } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import TicketBadge from "./TicketBadge";
import TicketDate from "./TicketDate";

import statusChangeButtonConfig from "../../configs/statusChangeButton";

import {
    showTicketModal,
    fetchTicket,
    updateTicket
} from "../../actions/ticketActions";

import {
    selectTicketByKey,
    selectTicketStatuses,
    selectTicketSeverities,
    selectShowTicketModal,
    selectRequestStatus
} from "../../selectors";

class TicketDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.getStatusChangeButton = this.getStatusChangeButton.bind(this);
        this.getTicket = this.getTicket.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
    }

    componentDidMount() {
        this.props.fetchTicket(this.getTicketKey());
    }

    getStatusChangeButton(ticket) {
        if (ticket) {
            const { status } = ticket;

            return statusChangeButtonConfig[status];
        }

        return {};
    }

    getTicketKey() {
        const { match } = this.props;

        return match.params.ticketKey;
    }

    getTicket() {
        const { getTicketByKey } = this.props;

        return getTicketByKey(this.getTicketKey());
    }

    editHandler() {
        const { showTicketModal, match } = this.props;
        const { ticketKey } = match.params;

        showTicketModal({
            editTicketKey: ticketKey
        });
    }

    statusChangeHandler() {
        const ticket = this.getTicket();
        const statusChangeButton = this.getStatusChangeButton(ticket);
        const { id } = ticket;
        const { newStatus } = statusChangeButton;

        this.props.updateTicket(id, {
            status: newStatus.toString(),
            lastModified: new Date()
        });
    }

    render() {
        const ticket = this.getTicket();
        const { ticketStatuses, ticketSeverities, requestStatus } = this.props;
        const statusChangeButton = this.getStatusChangeButton(ticket);
        const status = ticket && ticket.status;

        return (
            <React.Fragment>
                {ticket ? (
                    <React.Fragment>
                        <h1>{ticket.name}</h1>
                        <Button
                            className="ticket-detail-button"
                            variant="dark"
                            onClick={this.editHandler}
                            disabled={requestStatus.pending}
                        >
                            Edit
                        </Button>
                        <Button
                            className="ticket-detail-button"
                            variant="dark"
                            action={statusChangeButton.action}
                            onClick={this.statusChangeHandler}
                            disabled={requestStatus.pending}
                        >
                            {statusChangeButton.text}
                        </Button>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <b>Status:</b>{" "}
                                <TicketBadge
                                    value={ticketStatuses.byIds[status]}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <b>Severity:</b>{" "}
                                <TicketBadge
                                    value={
                                        ticketSeverities.byIds[ticket.severity]
                                    }
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
                ) : !ticket && requestStatus.pending ? (
                    <Spinner animation="border" />
                ) : !ticket && requestStatus.error ? (
                    <Alert variant="danger">{requestStatus.error}</Alert>
                ) : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    getTicketByKey: selectTicketByKey(state),
    ticketStatuses: selectTicketStatuses(state),
    ticketSeverities: selectTicketSeverities(state),
    ticketModal: selectShowTicketModal(state),
    requestStatus: selectRequestStatus(state)
});

const mapDispatchToProps = {
    fetchTicket,
    updateTicket,
    showTicketModal
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketDetail);
