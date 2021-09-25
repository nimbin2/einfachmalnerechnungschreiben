import React, {Component} from "react";
import "./AddBill.sass";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import moment from 'moment';
import 'moment/locale/de';
import DatePicker, { registerLocale } from 'react-datepicker';
import de from "date-fns/locale/de";
import "react-datepicker/dist/react-datepicker.css";

import {faPlus, faMinus, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Api from "../Api";
import AddCustomer from "./components/AddCustomer";
import InfoButton from "./components/InfoButton";

registerLocale("de", de);

export default class AddBill extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitBill= this.handleSubmitBill.bind(this);
    }
    state = {
        toggleAddBill: false,
        inputError: false,
        loadScreen: false,
        optionsMwSt: ["19.0",  "16.0", "7.0", "0.0"],
        productDescription: "DESCRIPTION",
        //billNumber: moment().format('YYMMDDHHmmss'),
        bills: this.props.bills,
        billNumber: "0",
        billDate: new Date(),
        billValue: '?',
        position: [],
        user: this.props.user,
        customers: this.props.customers || "",
        activeSelectId: "",
        activeCustomer: ""
    };

    componentDidMount() {
        let activeSelectId = ""
        let activeCustomer = ""

        this.handleAddPosition();
        this.getBillNumberLogic()

        if (this.state.bills && this.props.customers && this.props.customers.length) {
            if (this.props.customers.find((el) => el.id === parseInt(this.state.bills.sort(({ billNumber: previousID }, { billNumber: currentID }) => currentID - previousID)[0].billCustomerId))) {
                activeSelectId = parseInt(this.state.bills.sort(({billNumber: previousID}, {billNumber: currentID}) => currentID - previousID)[0].billCustomerId)
                activeCustomer = this.props.customers.find((el) => el.id === parseInt(this.state.bills.sort(({ billNumber: previousID }, { billNumber: currentID }) => currentID - previousID)[0].billCustomerId))
            }
        } else if (this.props.customers.length > 0) {
            activeSelectId = this.props.customers.sort(({ id: previousID }, { id: currentID }) => currentID - previousID)[0].id
            activeCustomer = this.props.customers.sort(({ id: previousID }, { id: currentID }) => currentID - previousID)[0]
        } else {
            activeSelectId = ""
            activeCustomer = ""
        }
        this.setState({
            activeSelectId: activeSelectId,
            activeCustomer: activeCustomer
        })

    }

    getBillNumberLogic = () => {
        let lastActiveNumber = this.state.bills ? this.state.bills.sort(({ billNumber: previousID }, { billNumber: currentID }) => currentID - previousID)[0].billNumber : "0"
        console.log("uee: ", lastActiveNumber, this.state.bills)
        let logic = this.state.user.billNumberLogic
        let billNumber

        if (logic.startsWith("+")) {
            // eslint-disable-next-line no-eval
            billNumber = eval(lastActiveNumber+logic)
        } else {
            billNumber = moment().format(logic)
        }

        if (parseInt(billNumber) <= parseInt(lastActiveNumber)) {
            // eslint-disable-next-line no-eval
            billNumber = eval(lastActiveNumber)+1
        }

        this.setState({billNumber: billNumber})
    }

    handleDateChange = date => {
        this.setState({
            billDate: date
        });
    };


    loadCustomers = () => {
        this.props.loadCustomers()
    };

    handleLoadCustomersAndSelect = (id) => {
        Api.getCustomers().then((response) => {
            this.setState({
                customers: response.data
            });
            this.setState({
                activeCustomer: this.state.customers.find((el) => el.id === id),
                activeSelectId: this.state.customers.find((el) => el.id === id).id
            });
        });
    };

    handleSelectCustomer = (event) => {
        this.setState({
            activeCustomer: this.state.customers.find((el) => el.id === parseInt(event, 10)),
            activeSelectId: this.state.customers.find((el) => el.id === parseInt(event, 10)).id,
            hideCreateTemplate: true
        });
    };

    handleAddPosition = () => {
        let newposition_netto = this.state.position_netto + 1;
        const item = {
            positionDescription: "",
            positionNetto: "",
            positionMwst: '19'
        };
        this.setState({
            position: [...this.state.position, item],
            position_netto: newposition_netto
        });
        this.state.position.length > 0 && window.setTimeout(() => {
            document.getElementById("addBill").scrollTo({
                top: document.getElementById("addBill").getElementsByClassName("scroll-content")[0].scrollHeight,
                behavior: 'smooth',
            })
        }, 50)
    };

    handleRemoveSpecificPosition = (idx) => () => {
        const position = [...this.state.position];
        position.splice(idx, 1);
        this.setState({
            position
        })
    };

    handlePositionChange = (idx, e) => {

        const {name, value} = e.target;
        const position = [...this.state.position];

        position[idx] = {
            ...position[idx],
            [name]: value
        };
        this.setState({
            position
        });
    };

    handleSubmitBill = () => {
        let positions = this.state.position;
        let inputError = false
        positions.forEach((item) => {
            Object.keys(item).forEach(keys => {
                if (!item[keys]) {
                    inputError = true
                }
            })
        } )

        if (!inputError && this.state.activeCustomer && this.state.billNumber) {
            Api.createBill(this.state.billNumber, this.state.billDate, this.state.activeCustomer.id, this.state.activeCustomer.companyName, this.state.activeCustomer.name, this.state.activeCustomer.street, this.state.activeCustomer.zip, this.state.activeCustomer.town, this.state.activeCustomer.text1, this.state.activeCustomer.text2, this.state.position, this.state.user.companyName, this.state.user.fullName, this.state.user.street, this.state.user.zip, this.state.user.town, this.state.user.phone, this.state.user.email, this.state.user.ustrNr, this.state.user.bankname, this.state.user.iban, this.state.user.bic, this.state.user.taxOffice).then(() => {
                this.props.forwardPage("bills")
            });
            this.setState({
                loadScreen: true,
                inputError: false
            })
        } else {
            this.setState({
                inputError: true
            })
            window.setTimeout(() => {
                document.getElementById("addBill").scrollTo(0, document.getElementsByClassName("error")[0].getBoundingClientRect().top)
            }, 150)
        }
    };

    render() {
        return (
            <div id="addBill" className="AddBill page-content">
                <div className="addBill-container position-relative scroll-content fix-table-noScroll">
                    <div className={`loadScreen ${!this.state.loadScreen ? "d-none" : ""}`}><FontAwesomeIcon icon={faSpinner}/></div>
                    <Row style={{height: "0px"}}>
                        <Col className="pl-0">
                            <div className="col-pageHeader"><h2 className="pageHeader">Neue Rechnung</h2></div>
                            <br/>
                            <br/>
                        </Col>
                    </Row>
                    <div className="block-topleft"/>
                    <Row className="row-inputTopLeft">
                        <Col className="d-flex flex-column align-items-end pr-0">
                            <InfoButton infoClass="adBillNumber" setLeft={true} dontBlur={true}/>
                            <FormControl id="adBillNumber" type="number" title="Rechnungsnummer" placeholder="Rechnungsnummer"
                                         className={`input-billNumber ${this.state.inputError && !this.state.billNumber ? "error" : ""}`}
                                         value={this.state.billNumber} onChange={(e) => {
                                this.setState({billNumber: e.target.value})}}/>
                            <DatePicker
                                popperPlacement="top-end"
                                title="Rechnungsdatum"
                                selected={this.state.billDate}
                                onChange={this.handleDateChange}
                                locale="de"
                                dateFormat="d. MMMM, yyyy"/>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                    <Row className="row-addCustomer">
                        <Col className="pr-0">
                            <AddCustomer loadCustomers={this.loadCustomers} title={"Header"} submitHandler={this.handleLoadCustomersAndSelect} activeCustomer={this.state.activeCustomer} reloadCustomers={() => this.props.loadCustomers()}/>
                        </Col>
                    </Row>
                    <Row className="row-selectCustomer">
                        <Col>
                            <div className="select-customer-container">
                                {this.props.customers.length > 0  ? (

                                    <div className={`select-customer ${this.state.inputError && !this.state.activeSelectId ? "error" : ""}`}>
                                        <FormControl as="select" onChange={(e) => this.handleSelectCustomer(e.target.value)}
                                                     title="Rechnungspartner"
                                                     value={this.state.activeSelectId}
                                                     className="select-right">
                                            {this.props.customers.sort(({ id: previousID }, { id: currentID }) => currentID - previousID).map((customer, ci) => (
                                                <option value={customer.id} key={ci}>
                                                    {customer.companyName}
                                                </option>
                                            ))}
                                        </FormControl>
                                    </div>
                                ) : <div style={{height: "42px"}}>...keine Partner gefunden...</div>}
                            </div>
                        </Col>
                    </Row>
                    <Row className="row-activeCustomer">
                        <Col>
                            <Container className={`activeCustomer ${this.state.inputError && !this.state.activeCustomer ? "error" : ""} ${this.state.activeCustomer ? 'show' : "show"}`}>
                                <br/>
                                <Row>
                                    <Col as={Col} md={4} sm={6}>
                                        <label title="Unternehmen">
                                            {this.state.activeCustomer ? this.state.activeCustomer.companyName : null}
                                        </label>
                                    </Col>
                                    <Col as={Col} md={4} sm={6}>
                                        <label title="Name">
                                            {this.state.activeCustomer ? this.state.activeCustomer.name : null}
                                        </label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={4} sm={6}>
                                        <label title="Straße">
                                            {this.state.activeCustomer ? this.state.activeCustomer.street : null}
                                        </label>
                                    </Col>
                                    <Col as={Col} md={4} sm={6}>
                                        <label title="Postleitzahl">
                                            {this.state.activeCustomer ? this.state.activeCustomer.zip : null}
                                        </label>
                                    </Col>
                                    <Col as={Col} md={{span: 4, offset: 0}} sm={{span: 6, offset: 6}}>
                                        <label title="Stadt">
                                            {this.state.activeCustomer ? this.state.activeCustomer.town : null}
                                        </label>
                                    </Col>
                                </Row>
                                <br/>
                            </Container>
                        </Col>
                    </Row>
                    <div className="break">
                        <br/>
                        <br/>
                    </div>
                    <Row><Col>
                        <div className="container-position">
                            <h4>Positionen:</h4>
                            <Table>
                                <tbody>
                                {this.state.position.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Form.Control as="textarea" rows="1" title="Beschreibung"
                                                          className={this.state.inputError && !item.positionDescription ? "error" : ""}
                                                          placeholder="Beschreibung"
                                                          name="positionDescription"
                                                          value={item.positionDescription ? item.positionDescription : ''}
                                                          onChange={(e) => {this.handlePositionChange(idx, e);}}/>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <Form.Control type="number" step="any" pattern="[0-9]+([\.,][0-9]+)?"
                                                              className={this.state.inputError && !item.positionNetto ? "error" : ""}
                                                              formNoValidate title="Netto"
                                                              placeholder="Netto"
                                                              name="positionNetto"
                                                              value={item.positionNetto ? item.positionNetto : ''}
                                                              onChange={(e) => { this.handlePositionChange(idx, e);}}/>

                                                <InputGroup.Append>
                                                    <InputGroup.Text>€</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            <Form.Control as="select" title="MwSt" name="positionMwst" value={item.positionMwst}
                                                          onChange={(e) => {
                                                              this.handlePositionChange(idx, e)
                                                          }}>
                                                {this.state.optionsMwSt.map((item, y) => (
                                                    <React.Fragment key={y}>
                                                        {item === "0.0" ? (
                                                            <option value={item}>
                                                                0% gemäß §19 UStG
                                                            </option>
                                                        ) : (
                                                            <option value={item}>
                                                                {parseInt(item)}%
                                                            </option>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </Form.Control>
                                        </td>
                                        <td className="td-btn-right" style={{ width: this.state.position.length === 1 ? "0" : "42px"}}>
                                            <Button className="btn-nDefault btn-delete"
                                                    title="Position entfernen"
                                                    disabled={this.state.position.length === 1}
                                                    onClick={this.handleRemoveSpecificPosition(idx)}>
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={3} className="td-tbn-left">
                                        <Button className="btn-nDefault btn-add" id="addBtn"
                                                title="Position hinzufügen" onClick={this.handleAddPosition}>
                                            <FontAwesomeIcon icon={faPlus}/>
                                        </Button>
                                    </td>
                                </tr>
                                </tfoot>
                            </Table>
                        </div>
                    </Col></Row>
                    <Button className="btn-tDefault btn-saveBill btn-tSubmit" onClick={this.handleSubmitBill}>
                        speichern
                    </Button>
                </div>
                <div className="page-padding-bottom"/>
            </div>
        );
    }
}
