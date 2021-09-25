import EscapeOutside from "react-escape-outside"
import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Api from "../../Api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH} from "@fortawesome/free-solid-svg-icons";


export default class AddCustomer extends Component {

    state = {
        newCompanyName : "",
        newName : "",
        newStreet : "",
        newZip : "",
        newTown : "",
        newText1: "",
        newText2: "",
        customers: [],
        defaultTexts: [],
        addingId: null,
        showTexts: false,
        submitError: false,
        isOpen: false
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

    handleSubmit = () => {
        if (this.state.newCompanyName && this.state.newName && this.state.newStreet && this.state.newZip && this.state.newTown) {
            this.setState({
                addMode: false,
                isOpen: false,
                newCompanyName : "",
                newName : "",
                newStreet : "",
                newZip : "",
                newTown : "",
                newText1: "",
                newText2: "",
                addingId: "",
            });
            let newText1 = this.state.newText1 ? this.state.newText1 : this.state.defaultTexts.text1
            let newText2 = this.state.newText2 ? this.state.newText2 : this.state.defaultTexts.text2
            newText1 = newText1.replace("$UNTERNEHMEN", this.state.newCompanyName)
            newText2 = newText2.replace("$UNTERNEHMEN", this.state.newCompanyName)
            Api.createCustomer(this.state.newCompanyName, this.state.newName, this.state.newStreet, this.state.newZip,  this.state.newTown, newText1, newText2).then((response) => {
                if(this.props.submitHandler) this.props.submitHandler(response.data.id);
                this.toggleaddM0de();
                this.props.reloadCustomers()
            });
            document.body.classList.remove('blur-page')
        } else {
            this.setState({submitError: true})
        }
    };

    toggleaddM0de = (id) => {
        this.setState({
            addMde: !this.state.addMde,
            addingId: id,
        });
    };
    handleEscapeOutside = () => {
        if (this.state.isOpen) {
            document.body.classList.remove('blur-page')
            this.setState({ isOpen: false })
        }
    }
    toggleAccordion = () => {
        !this.state.isOpen ? document.body.classList.add('blur-page') : document.body.classList.remove('blur-page');
        this.setState({isOpen: !this.state.isOpen, submitError: false })
    }
    render() {
        return (
            <div className="setAccordion" style={{zIndex: this.state.isOpen ? 110 : 1, width: this.state.isOpen ? "max-content" : "min-content"}}>
                <EscapeOutside onEscapeOutside={ () => this.handleEscapeOutside()} className={`mAccordion ${this.props.positonLeft ? "mAccordion-left" :""} `}
                               style={{height: this.state.isOpen ? "auto" : "0", zIndex: this.state.isOpen ? 110 : 1}}>
                    <React.Fragment>
                        <Button onClick={() => this.toggleAccordion()}
                                title="Rechnungspartner"
                                className={`btn-openAccordion btn-tDefault ${this.props.positonLeft ? "select-left" : "select-right"} ${this.props.isActive ? !this.state.isOpen ? "btn-semiActive" :"btn-active" : !this.state.isOpen ? "btn-semiActive" :"btn-inActive-on"}`}>
                            <div className="d-none d-lg-inline">Kundenvorlage</div><div className="d-lg-none">Vorlage</div>&nbsp;hinzufügen</Button>
                        <div  className={`mAccordion-container ${this.state.isOpen ? "show" : ""}`} style={{zIndex: this.state.isOpen ? 1 : -1 }}>
                            <div className={`card card-body collapse ${this.state.isOpen ? "show" : ""}`}>
                                <Form>
                                    <Form.Row className="pr-4">
                                        <Form.Group as={Col} sm={6} md={4} controlId="addBillForm.newCompanyName">
                                            <Form.Control type="text" title="Customer" placeholder="Unternehmen" required
                                                          value={this.state.newCompanyName} onChange={(e) => {
                                                this.handleInputChange("newCompanyName", e.target.value);
                                            }}/>
                                        </Form.Group>
                                        <Form.Group as={Col} sm={6} md={4} controlId="addBillForm.newName">
                                            <Form.Control type="text" title="Name" placeholder="Ansprechpartner"
                                                          value={this.state.newName} onChange={(e) => {
                                                this.handleInputChange("newName", e.target.value);
                                            }}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className="pr-4">
                                        <Form.Group as={Col} sm={6} md={4}
                                                    controlId="addBillForm.newBillCustomerStreet">
                                            <Form.Control type="text" title="Customer street and number"
                                                          placeholder="Straße und Nummer"
                                                          value={this.state.newStreet} onChange={(e) => {
                                                this.handleInputChange("newStreet", e.target.value);
                                            }}/>
                                        </Form.Group>
                                        <Form.Group as={Col} sm={6} md={4} controlId="addBillForm.newBillCustomerZip">
                                            <Form.Control type="text" title="Customer zip code"
                                                          placeholder="Postleitzahl"
                                                          value={this.state.newZip}
                                                          onChange={(e) => {
                                                              this.handleInputChange("newZip", e.target.value);
                                                          }}/>
                                        </Form.Group>
                                        <Form.Group as={Col} sm={6} md={4} controlId="addBillForm.newBillCustomer">
                                            <Form.Control type="text" title="Customer town"
                                                          placeholder="Stadt"
                                                          value={this.state.newTown}
                                                          onChange={(e) => {this.handleInputChange("newTown", e.target.value);}}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className={`${this.state.showTexts ? '' : 'd-none'}`}>
                                        <Form.Group as={Col} xs={12} md={6} controlId="addBillForm.newBillCustomerText1">
                                            <Form.Control type="text" title="Customer text1"
                                                          as="textarea" rows="4"
                                                          placeholder={this.state.defaultTexts.text1}
                                                          value={this.state.newText1}
                                                          onChange={(e) => {this.handleInputChange("newText1", e.target.value); }}/>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} md={6} controlId="addBillForm.newBillCustomerText2">
                                            <Form.Control type="text" title="Customer text2"
                                                          as="textarea" rows="4"
                                                          placeholder={this.state.defaultTexts.text2}
                                                          value={this.state.newText2}
                                                          onChange={(e) => { this.handleInputChange("newText2", e.target.value);}}/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className="align-items-end">
                                        <Button className="btn-nDefault btn-cardMore btn-white-blue" onClick={() => this.setState({showTexts: !this.state.showTexts})}>
                                            <FontAwesomeIcon icon={faEllipsisH}/>
                                        </Button>
                                        <Form.Group as={Col} controlId="addBillForm.newBillCustomerSave" className="text-right mb-0">
                                            {this.state.submitError === true ? (
                                                <div className="alert alert-danger" role="alert">
                                                    Ändern fehl geschlagen.
                                                </div>
                                            ) : null }
                                            <Button className="accordion-save-button btn-tDefault btn-tSubmit" type="submit" value="Submit"
                                                    onClick={(e)=> { e.preventDefault(); this.handleSubmit()}}>speichern</Button>
                                        </Form.Group>
                                    </Form.Row>
                                </Form>
                            </div>
                        </div>
                    </React.Fragment>
                </EscapeOutside>
            </div>
        );
    }
}
