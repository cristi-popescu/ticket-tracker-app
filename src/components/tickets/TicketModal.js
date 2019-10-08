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
    closeTicketModal,
    fetchTicketSuccess
} from "../../actions/ticketActions";
import {
    selectShowTicketModal,
    selectNextTicketKey,
    selectTicketStatuses,
    selectTicketSeverities,
    selectTicketByKey
} from "../../selectors";

class TicketModal extends Component {
    constructor(props) {
        super(props);

        this.state = this.getCreateState("");

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
        const { showTicketModal, getNextTicketKey } = this.props;
        const nextTicketKey = getNextTicketKey();

        return showTicketModal.editTicketKey || nextTicketKey;
    }

    getNextTicketKey() {
        const { getNextTicketKey } = this.props;

        return getNextTicketKey();
    }

    getCreateState() {
        return {
            key: "",
            status: "1",
            severity: this.props.severities.allIds[0].toString(),
            name: "",
            description: "",
            modalTitle: "Create Ticket",
            buttonText: "Submit",
            action: "create",
            showStatuses: false,
            updatePending: false,
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
            key: this.getTicketKey(),
            status,
            severity,
            name,
            description,
            modalTitle: "Edit Ticket",
            buttonText: "Save",
            action: "edit",
            showStatuses: true,
            updatePending: false,
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
        let actionPayload = {
            status,
            severity,
            name,
            description,
            lastModified: new Date()
        };
        let confirmationMessage = { status: true };
        let response = null;

        e.preventDefault();

        if (form.checkValidity()) {
            this.setState({
                updatePending: true
            });

            if (action === "edit") {
                const updateTicket = async actionPayload => {
                    const key = this.getTicketKey();
                    const { id } = getTicketByKey(key);

                    response = await fetch(
                        "https://ticket-tracker-json-server.herokuapp.com/tickets/" +
                            id,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(actionPayload)
                        }
                    );

                    if (response.ok) {
                        dispatch(
                            editTicket({
                                id,
                                ...actionPayload
                            })
                        );

                        this.handleClose();
                    }
                };

                updateTicket(actionPayload);
            } else {
                const createTicket = async actionPayload => {
                    const key = this.getNextTicketKey();

                    actionPayload = {
                        ...actionPayload,
                        key,
                        creationDate: actionPayload.lastModified
                    };

                    response = await fetch(
                        "https://ticket-tracker-json-server.herokuapp.com/tickets",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(actionPayload)
                        }
                    );

                    if (response.ok) {
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
                            ...this.getCreateState(""),
                            severity: "",
                            confirmationMessage
                        });
                    }
                };

                createTicket(actionPayload);
            }
        }
    }

    async handleShow() {
        const { dispatch } = this.props;
        this.setState({
            updatePending: true
        });

        // Temp solution, normally the service would handle generating a new key
        /* ... */
        const response = await fetch(
            "https://ticket-tracker-json-server.herokuapp.com/tickets/?_sort=key&_order=desc&limit=1"
        );

        if (response.ok) {
            const ticket = await response.json();
            dispatch(fetchTicketSuccess(ticket[0]));
        } else {
            throw new Error();
        }
        /* ... */

        const currentTicketKey = this.getTicketKey();
        const nextTicketKey = this.getNextTicketKey();

        if (currentTicketKey !== nextTicketKey) {
            this.setState(this.getEditState());
        } else {
            this.setState({
                ...this.getCreateState(),
                key: nextTicketKey
            });
        }
    }

    handleClose() {
        const { dispatch } = this.props;

        dispatch(closeTicketModal());

        this.setState({
            ...this.getCreateState(""),
            confirmationMessage: ""
        });
    }

    render() {
        const { statuses, severities, showTicketModal } = this.props;
        const {
            key,
            status,
            severity,
            name,
            description,
            confirmationMessage,
            modalTitle,
            showStatuses,
            buttonText,
            updatePending
        } = this.state;

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
                                        value={key}
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

                                <Button
                                    variant="dark"
                                    type="submit"
                                    disabled={updatePending}
                                >
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
    getNextTicketKey: selectNextTicketKey(state),
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
)(TicketModal);
