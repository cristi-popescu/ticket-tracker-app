import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import {
    addTicket,
    editTicket,
    closeTicketModal
} from "../actions/ticketActions";
import {
    selectShowTicketModal,
    selectNextTicketKey,
    selectTicketStatuses,
    selectTicketSeverities,
    selectTicketByKey
} from "../selectors";

class TicketSave extends Component {
    constructor(props) {
        super(props);

        this.state = this.getCreateState();

        this.getTicketKey = this.getTicketKey.bind(this);
        this.getCreateState = this.getCreateState.bind(this);
        this.getEditState = this.getEditState.bind(this);
        this.getConfirmationMessageText = this.getConfirmationMessageText.bind(
            this
        );
        this.getTicketLink = this.getTicketLink.bind(this);
        this.handleFormElementChange = this.handleFormElementChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    getTicketKey() {
        const { showTicketModal, nextTicketKey } = this.props;

        return showTicketModal.editTicketKey || nextTicketKey;
    }

    getCreateState() {
        return {
            status: "1",
            severity: this.props.severities.allIds[0].toString(),
            name: "",
            description: "",
            modalTitle: "Create Ticket",
            buttonText: "Submit",
            action: "create",
            showStatuses: false,
            confirmationMessage: {
                status: false,
                text: ""
            }
        };
    }

    getEditState() {
        const { showTicketModal, getTicketByKey } = this.props;
        const { status, severity, name, description } = getTicketByKey(
            showTicketModal.editTicketKey
        );

        return {
            status,
            severity,
            name,
            description,
            modalTitle: "Edit Ticket",
            buttonText: "Save",
            action: "edit",
            showStatuses: true,
            confirmationMessage: {
                status: false,
                text: ""
            }
        };
    }

    getConfirmationMessageText(action, ticketKey) {
        switch (action) {
            case "edit":
                return (
                    <React.Fragment>
                        Ticket {ticketKey} successfully updated.
                    </React.Fragment>
                );
            case "create":
            default:
                return (
                    <React.Fragment>
                        Ticket {this.getTicketLink(ticketKey)} successfuly
                        created.
                    </React.Fragment>
                );
        }
    }

    getTicketLink(ticketKey) {
        return (
            <Link to={"/ticket/" + ticketKey} onClick={this.handleClose}>
                {ticketKey}
            </Link>
        );
    }

    handleFormElementChange(e) {
        const { currentTarget } = e;

        this.setState({
            [currentTarget.name]: currentTarget.value
        });
    }

    handleFormSubmit(e) {
        const form = e.currentTarget;
        const { action, status, severity, name, description } = this.state;
        const { dispatch, getTicketByKey } = this.props;
        const key = this.getTicketKey();
        const actionPayload = {
            status,
            severity,
            name,
            description
        };
        let confirmationMessage = { status: true };

        e.preventDefault();

        if (form.checkValidity()) {
            if (action === "edit") {
                const { id } = getTicketByKey(key);

                dispatch(
                    editTicket({
                        id,
                        key,
                        ...actionPayload
                    })
                );

                this.handleClose();
            } else {
                dispatch(
                    addTicket({
                        key,
                        ...actionPayload
                    })
                );

                confirmationMessage = {
                    ...confirmationMessage,
                    text: this.getConfirmationMessageText(action, key)
                };

                this.setState({
                    ...this.getCreateState(),
                    severity: "",
                    confirmationMessage
                });
            }
        }
    }

    handleShow() {
        const { nextTicketKey } = this.props;
        const currentTicketKey = this.getTicketKey();

        if (currentTicketKey !== nextTicketKey) {
            this.setState(this.getEditState());
        } else {
            this.setState(this.getCreateState());
        }
    }

    handleClose() {
        const { dispatch } = this.props;

        dispatch(closeTicketModal());

        this.setState({
            ...this.getCreateState(),
            confirmationMessage: ""
        });
    }

    render() {
        const { statuses, severities, showTicketModal } = this.props;
        const {
            status,
            severity,
            name,
            description,
            confirmationMessage,
            modalTitle,
            showStatuses,
            buttonText
        } = this.state;
        const ticketKey = this.getTicketKey();

        return (
            <Modal
                show={showTicketModal.status}
                onShow={this.handleShow}
                onHide={this.handleClose}
                centered={true}
                size="lg"
                animation={false}
            >
                {!confirmationMessage.status ? (
                    <React.Fragment>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.handleFormSubmit}>
                                <Form.Group controlId="ticketKey">
                                    <Form.Label>Key</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ticketKey}
                                        disabled
                                    ></Form.Control>
                                </Form.Group>

                                {showStatuses && (
                                    <Form.Group controlId="ticketStatus">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            required
                                            name="status"
                                            value={status}
                                            onChange={
                                                this.handleFormElementChange
                                            }
                                        >
                                            {statuses.allIds.map(statusId => {
                                                return (
                                                    <option
                                                        key={statusId}
                                                        value={statusId}
                                                    >
                                                        {
                                                            statuses.byIds[
                                                                statusId
                                                            ]
                                                        }
                                                    </option>
                                                );
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                )}

                                <Form.Group controlId="ticketSeverity">
                                    <Form.Label>Severity</Form.Label>
                                    <Form.Control
                                        as="select"
                                        required
                                        name="severity"
                                        value={severity}
                                        onChange={this.handleFormElementChange}
                                    >
                                        {severities.allIds.map(severityId => {
                                            return (
                                                <option
                                                    key={severityId}
                                                    value={severityId}
                                                >
                                                    {
                                                        severities.byIds[
                                                            severityId
                                                        ]
                                                    }
                                                </option>
                                            );
                                        })}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="ticketName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ticket Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={this.handleFormElementChange}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId="ticketDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows="3"
                                        placeholder="Ticket Description"
                                        required
                                        name="description"
                                        value={description}
                                        onChange={this.handleFormElementChange}
                                    />
                                </Form.Group>

                                <Button variant="dark" type="submit">
                                    {buttonText}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Modal.Header closeButton />
                        <Alert variant="success">
                            {confirmationMessage.text}
                        </Alert>
                    </React.Fragment>
                )}
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    showTicketModal: selectShowTicketModal(state),
    nextTicketKey: selectNextTicketKey(state),
    severities: selectTicketSeverities(state),
    statuses: selectTicketStatuses(state),
    getTicketByKey: selectTicketByKey(state)
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators({ addTicket, closeTicketModal }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketSave);
