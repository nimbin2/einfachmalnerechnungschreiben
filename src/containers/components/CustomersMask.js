import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Api from "../../Api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPencilAlt, faEllipsisH} from "@fortawesome/free-solid-svg-icons";

import Modal from "react-bootstrap/Modal";
import EscapeOutside from "react-escape-outside";

export default class CustomersMask extends Component {

    state = {
        customers: this.props.customers || [],
        companyName: "",
        name: "",
        street: "",
        zip: "",
        town: "",
        text1: "",
        text2: "",
        editCustomer: [],
        positionEdit: "",
        editCi: "",
        addingId: null,
        addMode: false,
        editText: false,
        showTexts: false
    };

    componentDidMount() {
        this.loadDefaultTexts();
    }

    loadDefaultTexts = () => {
        Api.getDefaultTexts().then((response) => {
            this.setState({
                defaultTexts: response.data,
                newText1: response.data.text1,
                newText2: response.data.text2,
            });
        });
    };

    handleInputChange = (name, value) => {
        this.setState( {
            [name]: value
        });
    };

    handleCustomerInputChange = (value, name) => {
        this.setState(prevState => ({
            [name]: value,
            editCustomer: { ...prevState.editCustomer, [name]: value}
        }))
    };

    handleUpdateCustomer = (id) => {
        document.body.classList.remove('blur-page');
        this.setState({
            addMode: false,
            showDelete: false,
            editText: false,
            addingId: "" })
        let text1 = this.state.text1.replace("$UNTERNEHMEN", this.state.companyName).replace("$ANSPRECHPARTNER", this.state.name)
        let text2 = this.state.text2.replace("$UNTERNEHMEN", this.state.companyName).replace("$ANSPRECHPARTNER", this.state.name)
        Api.updateCustomer(id, this.state.companyName, this.state.name, this.state.street, this.state.zip, this.state.town, text1, text2)
            .then(() => this.props.reloadCustomers());
    };

    handleDeleteCustomer = (id) => {
        document.body.classList.remove('blur-page');
        this.setState({
            addMode: false,
            showDelete: false,
            editText: false,
            addingId: "" })
        Api.deleteCustomer(id).then(() => {
            this.props.reloadCustomers();
        });
    };

    toggleAddMode = (customer, cI) => {
        let id = customer.id
        if (!this.state.addMode ) {
            document.body.classList.add('blur-page');
            this.setState({
                editCustomer: {...customer},
                companyName: customer.companyName,
                name: customer.name,
                street: customer.street,
                zip: customer.zip,
                town: customer.town,
                text1: customer.text1,
                text2: customer.text2,
                addMode: true,
                addingId: id,
                editCi: cI,
                positionEdit: this.props.customers.length-cI > 2 ? document.getElementById(id).offsetTop+document.getElementById(id).offsetHeight : document.getElementById(id).offsetTop + 1
            })
            window.setTimeout(() => {
                document.getElementById("card-editCustomer").offsetHeight + 120 > document.body.offsetHeight &&
                    document.getElementById("card-editCustomer").scrollIntoView({behavior: "smooth", block: "center"})
            }, 150)
        } else {
            document.body.classList.remove('blur-page');
            this.setState({
                addMode: false,
                editText: false,
                addingId: "" })
        }
    };

    handleEscapeOutside = (id) => {
        if (this.state.addMode && this.state.addingId === id) {
            document.body.classList.remove('blur-page');
            this.setState({
                addMode: false,
                editText: false,
                addingId: "" })
        }
    }

    render() {
        return (
            <div className="customerTemplates scroll-content">
                <Modal show={this.state.showDelete} onHide={() => this.setState({showDelete: false})} className="modal-delete">
                    <Modal.Header closeButton>
                        <Modal.Title>Sicher löschen?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button onClick={() => this.handleDeleteCustomer(this.state.deleteId)} className="btn-tDelete">löschen</Button>
                    </Modal.Footer>
                </Modal>
                <Table className="fix-table-noScroll">
                    <tbody>
                        { this.props.customers && this.props.customers.sort(({ id: previousID }, { id: currentID }) => currentID - previousID).map((customer, cI) => (
                            <React.Fragment key={cI}>
                                <tr id={this.props.customers.length-cI < 3 ? customer.id : null}>
                                    <td className="td-companyName">
                                        <div title="Company name">{customer.companyName}</div>
                                    </td>
                                    <td className="td-name">
                                        <div title="Name">{customer.name}</div>
                                    </td>
                                    <td className="td-zip d-none d-md-table-cell">
                                        <div title="Zip">{customer.zip}</div>
                                    </td>
                                    <td className="p-0 position-relative td-btn-edit">
                                        <Button className="btn-nDefault btn-cardEdit btn-white-blue" onClick={() => this.toggleAddMode(customer, cI)}>
                                            <FontAwesomeIcon icon={faPencilAlt}/>
                                        </Button>
                                    </td>
                                </tr>
                                <tr id={this.props.customers.length-cI > 2 ? customer.id : null}>
                                    <td className="d-none d-md-table-cell"/>
                                    <td className="td-street text-right text-md-left">
                                        <div title="Street">{customer.street}</div>
                                    </td>
                                    <td className="td-zip d-md-none">
                                        <div title="Zip">{customer.zip}</div>
                                    </td>
                                    <td className="td-town">
                                        <div title="Town">{customer.town}</div>
                                    </td>
                                    <td className="d-none d-md-table-cell"/>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>

                {this.props.customers && (
                    <EscapeOutside onEscapeOutside={ () => this.handleEscapeOutside(this.state.addingId)} id="card-editCustomer"
                                   className={`card ${this.state.editText ? "editText" : ""} ${this.props.customers.length > 2 && this.props.customers.length-this.state.editCi < 3 ? "popUp" : ""} ${this.props.customers.length === 3 && this.state.editCi === 1 && this.state.editText ? "fixPosition" : ""}`}
                                   style={{top: this.state.positionEdit, display: !this.state.addMode ? "none" : ""}}>
                        <div className={`card-body ${this.state.addMode && this.state.addingId === this.state.editCustomer.id ? 'edit' : 'state'} customerRow`}  >
                            <div className={this.state.addMode && this.state.addingId === this.state.editCustomer.id ? "" : "d-none"}>
                                <Button className="deleteCustomer-button btn-delete" variant="danger" onClick={() => {this.setState({showDelete: true, deleteId: this.state.addingId})}}>
                                    <FontAwesomeIcon icon={faMinus}/></Button>
                                <Form>
                                    <Form.Row className="pr-4">
                                        <Form.Group as={Col} md={4} sm={12}>
                                            <Form.Control type="text" title="Company name" placeholder="Company name"
                                                          value={this.state.companyName}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "companyName")}/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={4} sm={12}>
                                            <Form.Control type="text" title="Name" placeholder="Name" value={this.state.name}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "name")}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className="pr-4">
                                        <Form.Group as={Col} md={4} sm={12}>
                                            <Form.Control type="text" title="Street" placeholder="Street" value={this.state.street}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "street")}/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={4} sm={12} controlId="customerForm.zip">
                                            <Form.Control type="text" title="Zip" placeholder="Zip" value={this.state.zip}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "zip")}/>
                                        </Form.Group>
                                        <Form.Group as={Col} md={4} sm={12}>
                                            <Form.Control type="text" title="Town" placeholder="Town" value={this.state.town}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "town")}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className={`pr-4 ${!this.state.editText ? "d-none" : ""}`}>
                                        <Form.Group as={Col} xs={12} md={6} controlId="addBillForm.newBillCustomerText1">
                                            <Form.Control type="text" title="Customer text1"
                                                          as="textarea" rows="4"
                                                          placeholder={this.state.editCustomer.text1}
                                                          value={this.state.text1}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "text1")}/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} md={6} controlId="addBillForm.newBillCustomerText2">
                                            <Form.Control type="text" title="Customer text2"
                                                          as="textarea" rows="4"
                                                          placeholder={this.state.editCustomer.text2}
                                                          value={this.state.text2}
                                                          onChange={(e) => this.handleCustomerInputChange(e.target.value, "text2")}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row >
                                        <Form.Group as={Col} xs={1} className="mb-0 d-flex align-items-end">
                                            <Button className="btn-nDefault btn-cardMore btn-white-blue" onClick={() => {
                                                this.setState({editText: !this.state.editText});
                                                window.setTimeout(() => { document.getElementById("card-editCustomer").offsetHeight + 120 > document.body.offsetHeight && document.getElementById("card-editCustomer").scrollIntoView({  behavior: 'smooth'})}, 150)
                                            }}>
                                                <FontAwesomeIcon icon={faEllipsisH}/>
                                            </Button>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={11} className="saveCustomer">
                                            <Button className="accordion-save-button btn-tSubmit" type="submit" variant="primary" onClick={(event) => {event.preventDefault(); this.handleUpdateCustomer(this.state.editCustomer.id);}}>speichern</Button>
                                        </Form.Group>
                                    </Form.Row>
                                </Form>
                            </div>
                        </div>
                    </EscapeOutside>
                )}
            </div>
        );
    }
}
