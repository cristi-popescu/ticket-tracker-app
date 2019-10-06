import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { addTicket, closeTicketAddModal } from "../actions/ticketActions";
import {
    selectShowTicketAddModal,
    selectNextTicketKey,
    selectLastTicketKey,
    selectTicketSeverities
} from "../selectors";

class TicketAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            severity: props.severities.allIds[0].toString(),
            name: "",
            description: ""
        };

        this.handleFormElementChange = this.handleFormElementChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleFormElementChange(e) {
        const { currentTarget } = e;

        this.setState({
            [currentTarget.name]: currentTarget.value
        });
    }

    handleFormSubmit(e) {
        const form = e.currentTarget;
        const { dispatch, nextTicketKey: key } = this.props;

        e.preventDefault();

        if (form.checkValidity()) {
            dispatch(
                addTicket({
                    key,
                    ...this.state
                })
            );

            this.setState({
                severity: "",
                name: "",
                description: "",
                confirmationMessage: "Ticket successfully created"
            });
        }
    }

    handleClose() {
        const { dispatch } = this.props;

        dispatch(closeTicketAddModal());

        this.setState({
            confirmationMessage: ""
        });
    }

    render() {
        const {
            lastTicketKey,
            nextTicketKey,
            severities,
            showTicketAddModal
        } = this.props;
        const { severity, name, description, confirmationMessage } = this.state;

        return (
            <Toast
                show={showTicketAddModal}
                onClose={this.handleClose}
                animation={false}
            >
                {!confirmationMessage ? (
                    <React.Fragment>
                        <Toast.Header>Create Ticket</Toast.Header>
                        <Toast.Body>
                            <Form onSubmit={this.handleFormSubmit}>
                                <Form.Group controlId="ticketKey">
                                    <Form.Label>Key</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nextTicketKey}
                                        disabled
                                    ></Form.Control>
                                </Form.Group>

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
                                    Create
                                </Button>
                            </Form>
                        </Toast.Body>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Toast.Header />
                        <Alert variant="success">
                            Ticket {lastTicketKey} successfully created.
                        </Alert>
                    </React.Fragment>
                )}
            </Toast>
        );
    }
}

const mapStateToProps = state => ({
    showTicketAddModal: selectShowTicketAddModal(state),
    lastTicketKey: selectLastTicketKey(state),
    nextTicketKey: selectNextTicketKey(state),
    severities: selectTicketSeverities(state)
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators({ addTicket, closeTicketAddModal }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketAdd);
