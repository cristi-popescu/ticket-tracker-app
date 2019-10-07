import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ListGroup from "react-bootstrap/ListGroup";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import TicketBadge from "./TicketBadge";
import TicketDate from "./TicketDate";

import {
    changeTicketStatus,
    showTicketModal,
    fetchTicketsPending,
    fetchTicketSuccess,
    fetchTicketsError
} from "../../actions/ticketActions";

import {
    selectTicketByKey,
    selectTicketStatuses,
    selectTicketSeverities,
    selectShowTicketModal,
    selectRequestStatus
} from "../../selectors";

class TicketDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statusChangeButton: {},
            updatePending: false
        };

        this.getStatusChangeButtonConfig = this.getStatusChangeButtonConfig.bind(
            this
        );
        this.getStatusChangeButton = this.getStatusChangeButton.bind(this);
        this.getTicket = this.getTicket.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
    }

    async fetchTicket() {
        const { dispatch } = this.props;

        dispatch(fetchTicketsPending());

        try {
            const response = await fetch(
                "http://localhost:3001/tickets?key=" + this.getTicketKey()
            );

            if (response.ok) {
                const ticket = await response.json();

                dispatch(fetchTicketSuccess(ticket[0]));

                this.setState({
                    statusChangeButton: this.getStatusChangeButton()
                });
            } else {
                throw new Error();
            }
        } catch (e) {
            dispatch(fetchTicketsError("Error loading ticket."));
        }
    }

    componentDidMount() {
        this.fetchTicket();
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

    getTicketKey() {
        const { match } = this.props;

        return match.params.ticketKey;
    }

    getTicket() {
        const { getTicketByKey } = this.props;

        return getTicketByKey(this.getTicketKey());
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
        const { dispatch } = this.props;
        const { newStatus } = statusChangeButton;
        const { id } = this.getTicket();

        const updateTicketStatus = async () => {
            try {
                this.setState({
                    updatePending: true
                });

                let lastModified = new Date();

                await fetch("http://localhost:3001/tickets/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus.toString(),
                        lastModified
                    })
                });

                dispatch(
                    changeTicketStatus({
                        id,
                        newStatus: statusChangeButton.newStatus,
                        lastModified
                    })
                );

                this.setState({
                    statusChangeButton: this.getStatusChangeButtonConfig()[
                        newStatus
                    ],
                    updatePending: false
                });
            } catch (e) {}
        };

        updateTicketStatus();
    }

    render() {
        const ticket = this.getTicket();
        const { ticketStatuses, ticketSeverities, requestStatus } = this.props;
        const { statusChangeButton, updatePending } = this.state;
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
                            disabled={updatePending}
                        >
                            Edit
                        </Button>
                        <Button
                            className="ticket-detail-button"
                            variant="dark"
                            action={statusChangeButton.action}
                            onClick={this.statusChangeHandler}
                            disabled={updatePending}
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

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators({ changeTicketStatus, showTicketModal }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketDetail);
