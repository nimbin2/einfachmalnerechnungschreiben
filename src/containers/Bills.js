import React, {Component} from "react";
import "./Bills.sass";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faEye, faEllipsisH, faTimes, faSpinner} from "@fortawesome/free-solid-svg-icons";
import Api from "../Api";

import moment from 'moment';
import 'moment/locale/de';
import FormControl from "react-bootstrap/FormControl";
import DatePicker from "react-datepicker";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import fileDownload from "js-file-download";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default class Bills extends Component {
    state = {
        savedBillsMonth: [{name: 'September', value: 'September',}, {name: 'August', value: 'August',}, {name: 'Juli', value: 'Juli'}],
        savedBillsOfMonth: [{name: 'September', value: 'September',}, {name: 'August', value: 'August',}, {name: 'Juli', value: 'Juli'}],
        positionMwstOptions: [{name: '19%', value: '19',}, {name: '16%', value: '16',}, {name: '7%', value: '7',}, {name: '0% gemäß §19 UStG', value: '0'}],
        bills: this.props.bills,
        user: this.props.user,
        customers: this.props.customers,
        editBill: [{}],
        editBillPositions: [{}],
        activeCustomer: [{}],
        position: [],
        positionDescription: "",
        positionNetto: "",
        positionMwst: "",
        item : null,
        show: false,
        showPdf: false,
        updateUserInfo: false,
        activeBillId: "",
        billPdf: "",
        openEdit: false,
        editError: false,
        numPages: null,
        pageNumber: 1,
        loadScreen: false,
        sortToTop: true
    };

    deleteBill = (id) => {
        Api.deleteBill(id).then(() => {
            this.props.reloadBills()
            this.setState({
                showDelete: false,
            });
        })
    };

    handleModalEditBillOpen = (id) => {
        Api.getBills().then((response) => {
            this.setState({
                editBill: response.data.find((el) => el.id === id),
                activeCustomer: {
                    id: response.data.find((el) => el.id === id).billCustomerId,
                    companyName: response.data.find((el) => el.id === id).billCustomerCompanyName,
                    name: response.data.find((el) => el.id === id).billCustomerName,
                    street: response.data.find((el) => el.id === id).billCustomerStreet,
                    zip: response.data.find((el) => el.id === id).billCustomerZip,
                    town: response.data.find((el) => el.id === id).billCustomerTown
                },
                position: response.data.find((el) => el.id === id).billPositions,
                show: true
            });
        });
    };

    handleEditBill = (name, value) => {
        const editBill = { ...this.state.editBill,  [name]: value };
        this.setState({editBill: editBill});
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
    handleRemoveSpecificPosition = (idx) => () => {
        const position = [...this.state.position];
        position.splice(idx, 1);
        this.setState({
            position
        })
    };
    handleSubmitEditBill = () => {
        let newText1 = this.state.activeCustomer.text1
        let newText2 = this.state.activeCustomer.text2
        if (!newText1) {
            newText1 = ""
        }
        if (!newText2) {
            newText2 = ""
        }
        if(this.state.updateUserInfo) {
            //Api.updateBill(this.state.editBill.id, this.state.editBill.billNumber, this.state.editBill.billDate, this.state.activeCustomer.id, this.state.activeCustomer.companyName, this.state.activeCustomer.name, this.state.activeCustomer.street, this.state.activeCustomer.zip, this.state.activeCustomer.town, newText1, newText2, this.state.position, this.state.user.companyName, this.state.user.fullName, this.state.user.street, this.state.user.zip, this.state.user.town, this.state.user.phone, this.state.user.email, this.state.user.ustrNr, this.state.user.bankname, this.state.user.iban, this.state.user.bic, this.state.user.taxOffice);
        }

        let inputError = false
        this.state.position.forEach((item) => {
            Object.keys(item).forEach(keys => {
                if (!item[keys]) {
                    inputError = true
                }
            })
        })
        inputError = !this.state.editBill.billNumber ? true : inputError
        inputError = !this.state.editBill.billDate ? true : inputError
        !inputError &&
        !inputError && Api.updateBill(this.state.editBill.id, this.state.editBill.billNumber, this.state.editBill.billDate, this.state.activeCustomer.id, this.state.activeCustomer.companyName, this.state.activeCustomer.name, this.state.activeCustomer.street, this.state.activeCustomer.zip, this.state.activeCustomer.town, newText1, newText2, this.state.position, this.state.editBill.userCompanyName, this.state.editBill.userFullName, this.state.editBill.userStreet, this.state.editBill.userZip, this.state.editBill.userTown, this.state.editBill.userPhone, this.state.editBill.userEmail, this.state.editBill.userUstrNr, this.state.editBill.userBankname, this.state.editBill.userIban, this.state.editBill.userBic, this.state.editBill.userTaxOffice).then(() => this.props.reloadBills());
        !inputError ? this.setState({show: false}) : this.setState({editError: true});
    };

    downloadPdf = (id, billNumber) => {
        this.setState({
            loadScreen: true
        })
        Api.getBillPdf(id)
            .then((response) => {
                this.setState({billPdf: response.data, loadScreen: false})
                fileDownload(response.data, 'Rechnung_'+billNumber+'.pdf')
            });
    };

    viewPdf = (id) => {
        this.setState({
            loadScreen: true
        })
        Api.getBillPdf(id).then((response) => {
            this.setState({
                viewPdf: response.data,
                loadScreen: false,
                showPdf: true
            })
        });
    };

    render() {
        const {positionMwstOptions} = this.state;
        return (
            <div id="bills" className="Bills page-content">
                <div className={`loadScreen ${!this.state.loadScreen ? "d-none" : ""}`}><FontAwesomeIcon icon={faSpinner}/></div>
                <div className="col-pageHeader">
                    <h2 className="d-inline-block pageHeader" >Rechnungen</h2>
                </div>
                <br/>
                <br/>
                <Table hover className="fix-table-noScroll scroll-content">
                    <thead className="thead-style">
                    <tr>
                        <th className="th-number"><Button className={`btn-noStyle btn-sortTable ${this.state.sortToTop ? `up` : null}` } onClick={() => this.setState({sortToTop: !this.state.sortToTop})}>Nummer</Button></th>
                        <th className="th-date"><div>Datum</div></th>
                        <th className="th-companyName"><div>Unternehmen</div></th>
                        <th/>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.bills && this.state.bills.sort(({ billNumber: previousID }, { billNumber: currentID }) => this.state.sortToTop ? currentID - previousID : previousID - currentID).map((item, idx) => (
                        <tr key={idx} className={`billsRow ${!item.billDate ? "d-none" : ""}`}>
                            <td className="td-number">
                                <label className="m-0">{item.billNumber}</label>
                            </td>
                            <td className="td-date">
                                <label className="m-0">{moment(item.billDate).format("DD. MMMM, YYYY")}</label>
                            </td>
                            <td className="td-companyName">
                                <label className="m-0">{item.billCustomerCompanyName}</label>
                            </td>
                            <td className="table-btn-right">
                                <Button className="btn-nDefault btn-white-blue" onClick={() => this.viewPdf(item.id)}><FontAwesomeIcon icon={faEye}/></Button>
                            </td>
                            <td className="table-btn-right">
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" className="btn-nDefault btn-white-blue">
                                        <FontAwesomeIcon icon={faEllipsisH}/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => this.downloadPdf(item.id, item.billNumber)}>herunterladen</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.handleModalEditBillOpen(item.id)}>bearbeiten</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => this.setState({showDelete: true, deleteId: item.id})}>löschen</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className="page-padding-bottom"/>

                <Modal show={this.state.showPdf} onHide={() => this.setState({showPdf: false})} className="modalPdf">
                    <Button className="btn-pdfModal-close d-md-none btn-noStyle" onClick={() => this.setState({showPdf: false})}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Button>
                    <Modal.Body>
                        <Document file={this.state.viewPdf}>
                            <Page pageNumber={1}/>
                        </Document>
                        <br/>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showDelete} onHide={() => this.setState({showDelete: false})}
                        className="modal-delete">
                    <Modal.Header closeButton>
                        <Modal.Title>Sicher löschen?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button onClick={() => this.deleteBill(this.state.deleteId)} className="btn-tDefault btn-tDelete">löschen</Button>
                    </Modal.Footer>
                </Modal>

                <Modal className="modal-editBill" show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header>
                        <Modal.Title>{this.state.editBill.billCustomerCompanyName}</Modal.Title>

                        <div className="inputGroup d-inline-block">
                            <FormControl type="number" title="Rechnungsnummer" placeholder="Rechnungsnummer"
                                         value={this.state.editBill.billNumber}
                                         onChange={(e) => this.handleEditBill("billNumber", e.target.value)}/>
                            <DatePicker
                                selected={moment(this.state.editBill.billDate).toDate()}
                                onChange={(date) => this.handleEditBill("billDate", date)}
                                dateFormat="d. MMMM, yyyy"/>
                        </div>
                        <Button className="d-none" onClick={() => this.setState({show: false})}>
                            Close
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <br/>
                        <br/>
                        {this.state.customers ? (
                            <FormControl as="select" className="select-customer" onChange={(event) => this.setState({activeCustomer: this.state.customers.find((el) => el.id === parseInt(event.target.value, 10))})}>
                                <option>
                                    {this.state.editBill.billCustomerCompanyName}
                                </option>
                                {this.state.customers.map((customer, ci) => (
                                    <option value={customer.id} key={ci}>
                                        {customer.companyName}
                                    </option>
                                ))}
                            </FormControl>
                        ) : null}
                        <Form.Group controlId="formBasicCheckbox" className="persionalInfo d-none">
                            <Form.Check type="checkbox" label='Persönliche daten aktualisieren'/>
                        </Form.Group>
                        <br/>
                        <br/>
                        <Table>
                            <tbody>
                            {this.state.position.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="td-positionName">
                                        <Form.Control as="textarea" rows="1" title="Position description"
                                                      placeholder="Beschreibung"
                                                      name="positionDescription"
                                                      value={item.positionDescription ? item.positionDescription : ''}
                                                      onChange={(e) => {
                                                          this.handlePositionChange(idx, e);
                                                      }}/>
                                    </td>
                                    <td className="td-input">
                                        <InputGroup className="mb-3">
                                            <Form.Control type="number" step="any" pattern="[0-9]+([\.,][0-9]+)?"
                                                          formNoValidate title="Netto"
                                                          placeholder="Netto"
                                                          name="positionNetto"
                                                          value={item.positionNetto ? item.positionNetto : ''} onChange={(e) => {
                                                this.handlePositionChange(idx, e);
                                            }}/>

                                            <InputGroup.Append>
                                                <InputGroup.Text>€</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                        <Form.Control as="select" title="MwSt" name="positionMwst"
                                                      value={item.positionMwst}
                                                      onChange={(e) => {
                                                          this.handlePositionChange(idx, e)
                                                      }}>
                                            {positionMwstOptions.map((sitem, ii) => (
                                                <option key={ii} value={sitem.value}>
                                                    {sitem.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </td>
                                    <td className={`td-btn-right position-relative ${this.state.position.length === 1 && "d-none"}`}>
                                        <Button variant="outline-primary btn-delete" id="removeBtn"
                                                disabled={this.state.position.length === 1 && true}
                                                onClick={this.handleRemoveSpecificPosition(idx)}>
                                            <FontAwesomeIcon icon={faMinus}/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={3} className="td-addPosition">
                                    <Button className="btn-tSubmit btn-add" id="addBtn"
                                            disabled={!this.state.editBill.billNumber && !this.state.editBill.billDate && this.state.position === 0} onClick={this.handleAddPosition}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </Button>
                                </td>
                            </tr>
                            </tfoot>
                        </Table>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-tSubmit" type="submit" onClick={this.handleSubmitEditBill}>
                            speichern
                        </Button>
                        <div className={`alert alert-danger ${!this.state.editError ? "d-none" : "" }`} role="alert">
                            Alle Felder müssen ausgefüllt sein.
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
