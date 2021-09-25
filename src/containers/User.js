import React, { Component } from "react";
import "./User.sass";
import InfoButton from "./components/InfoButton";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Api from "../Api";
import {faEdit, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import EscapeOutside from "react-escape-outside";
import moment from "moment";


export default class User extends Component {
    state= {
        user: this.props.user || "",
        taxUstrCheckDefault: "unwichtig",
        taxUstrCheckUsed: "",
        userDataError: false,
        password: "",
        newPassword: "",
        repeatPassword: "",
        stateUpdatePassword: "",
        newUserName: "",
        newUserPassword: "",
        newUserRepeatPassword: "",
        newUserRoles: [{ name: "Benutzer", value: "ROLE_USER" }, { name: "Admin", value: "ROLE_ADMIN"} ],
        newUserRole: "ROLE_USER",
        stateNewUser: "",
        taxUstrCheckOptions: [{name: 'unwichtig', value: 'unwichtig'}, {name: 'pro Quartal', value: 'proQuartal'}, {name: 'pro Monat', value: 'proMonat'}],
        editMode: false,
        billNumber: "",
        editPassword: false
    }

    handleInputChange = ( name, value) => {
        this.setState({
            user: {
                ...this.state.user,
                [name]: value
            },

        });
    };

    handleUstrCheckChange = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                taxUstrCheck: e
            }
        })
    }

    handleSaveUserChanges = () => {
        if (this.state.editMode) {
            let data = this.state.user
            let userDataError = false
            Object.keys(data).map((key) => {
                if (!data[key]) {
                    userDataError = true
                }
                return userDataError
            });

            if (Object.keys(data).find(key => data[key] === "" || data[key] === null)) {
                this.setState({userDataError: true})
                window.setTimeout(() => {
                    document.getElementById("user").scrollTo(0, document.getElementsByClassName("error")[0].getBoundingClientRect().top+295)
                }, 250)
            } else {
                window.loadScreen = true
                window.scrollTo(0, 0)
                this.testNumberLogic()
                Api.updateUser(this.state.user).then(() => {
                    this.props.loadUser()
                    window.loadScreen = false
                    this.setState({editMode: false});
                })
            }
        } else {
            this.state.user.username && this.setState({editMode: true});
        }
    };

    testNumberLogic = () => {
        let lastActiveNumber = this.props.bills ? this.props.bills.sort(({ billNumber: previousID }, { billNumber: currentID }) => currentID - previousID)[0].billNumber : 0
        let logic = this.state.user.billNumberLogic
        let billNumber

        if (logic.startsWith("+")) {
            // eslint-disable-next-line no-eval
            billNumber = eval(lastActiveNumber+logic)
        } else {
            billNumber = moment().format(logic)
        }

        if (parseInt(billNumber) < parseInt(lastActiveNumber)) {
            this.setState({
                user: {
                    ...this.state.user,
                    billNumberLogic: "+1"
                }
            })
        }
    }

    updatePassword = () => {
        window.setTimeout(() => {
            Api.updatePassword(this.state.password, this.state.newPassword, this.state.repeatPassword).then((response) => {
                if(response.data.success === true) {
                    document.body.classList.remove('blur-page')
                    this.setState({
                        stateUpdatePassword: "success",
                        editPassword: false,
                        password: "",
                        newPassword: "",
                        repeatPassword: ""
                    })
                } else {
                    this.setState({
                        stateUpdatePassword: "error"
                    })
                }
            })
        }, 150)
    }

    addUser = () => {
        window.setTimeout(() => {
            Api.addUser(this.state.newUserName, this.state.newUserPassword, this.state.newUserRepeatPassword, this.state.newUserRole).then((response) => {
                if(response.data.success === true) {
                    this.setState({
                        stateNewUser: "success"
                    })
                } else {
                    this.setState({
                        stateNewUser: "error"
                    })
                }
            })
        }, 150)
    }

    handleEscapeOutside = () => {
        if (this.state.editPassword) {
            document.body.classList.remove('blur-page')
            this.setState({
                editPassword: false,
                password: "",
                newPassword: "",
                repeatPassword: ""})
        }
    }

    render() {
            return (
            <div id="user" className="User page-content">
                <div className="col-pageHeader"><h2 className="pageHeader">Dein Profil</h2></div>

                <br/>
                <br/>
                <div className="container-btnEdit">
                    <Button className={`btn-tDefault btn-edit btn-edit-top ${this.state.editMode ? "d-none" : ""}`}
                            onClick={() => {
                                this.handleSaveUserChanges()
                            } }>
                        {this.state.editMode ? (<div>speichern</div>) : (<FontAwesomeIcon icon={faEdit}/>)}
                    </Button>
                    {this.state.editMode ? (
                        <Button className="btn-nDefault btn-discharge"
                                onClick={() => {this.setState({editMode: false})} }>
                            <FontAwesomeIcon icon={faTimes}/></Button>
                    ) : null }
                </div>
                <div className="scroll-content">
                    <Form className="position-relative fix-table-noScroll">
                        <div className="form-border">
                            <div className="container-buttons-top">
                                <Form.Control as="select" title="ustr select" name="ustr select" value={this.state.user.taxUstrCheck || ""}
                                              id="selectUstrSetting" className={this.state.editMode ? "select-right" : "select-no"}
                                              disabled={!this.state.editMode}
                                              onChange={(e) => this.handleUstrCheckChange(e.target.value)}>
                                    {this.state.taxUstrCheckOptions.map((idx, e) => (
                                        <option key={e} value={idx.value}>
                                            {idx.name}
                                        </option>
                                    ))}
                                </Form.Control>
                                <InfoButton dontBlur={true} infoClass="selectUstrSetting" reload={this.state.editMode}/>
                            </div>
                            <div className={`input-billLogic ${this.state.editMode ? "edit" : ""}`}>
                                <InfoButton dontBlur={true} setLeft={true} reload={this.state.editMode} infoClass="billLogic"/>
                                <Form.Group as={Row} controlId="userForm.ProfileBillLogic" id="billLogic">
                                    {this.state.editMode ? (
                                        <Form.Control type="text" placeholder="Rechnungsnummer Logik" title="Rechnungsnummer Logik" className={this.state.userDataError && !this.state.user.companyName ? "error" : ""}
                                                      pattern="[YMDhms+0-9]{2,14}" value={this.state.user.billNumberLogic || ""}
                                                      onChange={(e) => this.handleInputChange("billNumberLogic", e.target.value)}/>
                                    ) : (
                                        <Form.Label column title="Rechnungsnummer Logik">{this.state.user.billNumberLogic}</Form.Label>
                                    )}
                                </Form.Group>
                            </div>
                            <Form.Group as={Row} controlId="userForm.ProfileName">
                                <Form.Label column title="Profile name">Benutzername:</Form.Label>
                                <Form.Label column title="Profile name">{this.props.user.username}</Form.Label>
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileCompanyName">
                                <Form.Label column title="Company name">Firma:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Company name" placeholder="Company name" value={this.state.user.companyName || ""} className={this.state.userDataError && !this.state.user.companyName ? "error" : ""}
                                                      onChange={(e) => {this.handleInputChange("companyName", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Company name">{this.props.user.companyName}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileFullName">
                                <Form.Label column title="Full name">Vor- und Zuname:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Full name" placeholder="Full name" value={this.state.user.fullName || ""} className={this.state.userDataError && !this.state.user.fullName ? "error" : ""} onChange={(e) => {this.handleInputChange("fullName", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Full name">{this.props.user.fullName}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileStreet">
                                <Form.Label column title="Street and Number">Straße & Nummer:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Street and Number" placeholder="Street and Number" value={this.state.user.street || ""} className={this.state.userDataError && !this.state.user.street ? "error" : ""} onChange={(e) => {this.handleInputChange("street", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Street and Number">{this.props.user.street}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileZip">
                                <Form.Label column title="Zip code">Postleitzahl:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Zip code" placeholder="Zip code" value={this.state.user.zip || ""} className={this.state.userDataError && !this.state.user.zip ? "error" : ""} onChange={(e) => {this.handleInputChange("zip", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Zip code">{this.props.user.zip}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileTown">
                                <Form.Label column title="Town">Stadt:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Town" placeholder="Town" value={this.state.user.town || ""} className={this.state.userDataError && !this.state.user.town ? "error" : ""} onChange={(e) => {this.handleInputChange("town", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Town">{this.props.user.town}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfilePhone">
                                <Form.Label column title="Bill number">Telefonnummer: </Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Bill number" placeholder="Phone number" value={this.state.user.phone || ""} className={this.state.userDataError && !this.state.user.phone ? "error" : ""} onChange={(e) => {this.handleInputChange("phone", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Bill number">{this.props.user.phone}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileEmail">
                                <Form.Label column title="Email">E-Mail: </Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="email" title="Email" placeholder="Email" value={this.state.user.email || ""} className={this.state.userDataError && !this.state.user.email ? "error" : ""} onChange={(e) => {this.handleInputChange("email", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Email">{this.props.user.email}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileUstNr">
                                <Form.Label column title="UstNr">UstNr:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="UstNr" placeholder="UstNr" value={this.state.user.ustrNr || ""} className={this.state.userDataError && !this.state.user.ustrNr ? "error" : ""} onChange={(e) => {this.handleInputChange("ustrNr", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="UstNr">{this.props.user.ustrNr}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileBankname">
                                <Form.Label column title="Bank">Bank:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Bank" placeholder="Bank" value={this.state.user.bankname || ""} className={this.state.userDataError && !this.state.user.bankname ? "error" : ""} onChange={(e) => {this.handleInputChange("bankname", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Bank">{this.props.user.bankname}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileIban">
                                <Form.Label column title="IBAN">IBAN:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="IBAN" placeholder="IBAN" value={this.state.user.iban || ""} className={this.state.userDataError && !this.state.user.iban ? "error" : ""} onChange={(e) => {this.handleInputChange("iban", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="IBAN">{this.props.user.iban}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.profileBic">
                                <Form.Label column title="BIC">BIC:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="BIC" placeholder="BIC" value={this.state.user.bic || ""} className={this.state.userDataError && !this.state.user.bic ? "error" : ""} onChange={(e) => {this.handleInputChange("bic", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="BIC">{this.props.user.bic}</Form.Label>
                                )}
                            </Form.Group>
                            <Form.Group as={Row} controlId="userForm.ProfileTaxOffice">
                                <Form.Label column title="Tax Office">Finanzamt:</Form.Label>
                                {this.state.editMode ? (
                                    <Col>
                                        <Form.Control type="text" title="Tax Office" placeholder="Tax Office" value={this.state.user.taxOffice || ""} className={this.state.userDataError && !this.state.user.taxOffice ? "error" : ""} onChange={(e) => {this.handleInputChange("taxOffice", e.target.value);}}/>
                                    </Col>
                                ) : (
                                    <Form.Label column title="Tax Office">{this.props.user.taxOffice}</Form.Label>
                                )}
                            </Form.Group>

                            <Button className={`btn-tDefault btn-edit btn-edit-bottom ${!this.state.editMode ? "d-none" : "btn-tSubmit"}`}
                                    onClick={() => {
                                        this.handleSaveUserChanges()
                                    } }>
                                {this.state.editMode ? (<div>speichern</div>) : (<FontAwesomeIcon icon={faEdit}/>)}
                            </Button>
                        </div>
                    </Form>
                    <div className="user-bottom-container">
                        <br/>
                        <br/>
                        <div className="d-flex">
                            <Button className="btn-tDefault btn-blue-white btn-newPass" onClick={() => {
                                this.setState({editPassword: !this.state.editPassword, stateUpdatePassword: ""})
                                document.body.classList.add('blur-page')
                            }}>Passwort ändern: </Button>
                            {this.state.stateUpdatePassword === "success" ? (
                                <div className="alert alert-success alert-success-pw" role="alert">
                                    Dein Passwort würde geändert.
                                </div>
                            ) : null }
                        </div>
                        <br/>
                    </div>

                    <EscapeOutside onEscapeOutside={ () => this.handleEscapeOutside()} className={`mAccordion mAccordion-left`}
                                   style={{height: this.state.editPassword ? "auto" : "36px", zIndex: this.state.editPassword ? 110 : 1 }}>
                        <div  className={`mAccordion-container ${this.state.editPassword ? "show" : ""}`} style={{zIndex: this.state.editPassword ? 1 : -1 }}>
                            <div className={`card card-body collapse ppl ${this.state.editPassword ? "show" : ""}`}>
                                <Form className="form-changePassword">
                                    <React.Fragment>
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Control type="password" title="Password" placeholder="aktuelles Passwort" value={this.state.password} onChange={e => {this.setState({password: e.target.value })}}/>
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                                <Form.Control type="password" title="newPassword" placeholder="neues Passwort" value={this.state.newPassword}  onChange={e => {this.setState({newPassword: e.target.value })}}/>
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                                <Form.Control type="password" title="repeatPassword" placeholder="Passwort wiederholen" value={this.state.repeatPassword} onChange={e => {this.setState({repeatPassword: e.target.value })}}/>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} className="mb-0">
                                                {this.state.stateUpdatePassword === "success" ? (
                                                    <div className="alert alert-success" role="alert">
                                                        Dein Passwort würde geändert.
                                                    </div>
                                                ) : this.state.stateUpdatePassword === "error" ? (
                                                    <div className="alert alert-danger" role="alert">
                                                        Ändern fehl geschlagen.
                                                    </div>
                                                ) : null }
                                                <Button className="accordion-save-button btn-tDefault btn-tSubmit" type="submit" onClick={(e) => {this.updatePassword(); e.preventDefault()}}>Speichern</Button>
                                            </Form.Group>
                                        </Form.Row>
                                    </React.Fragment>
                                </Form>
                            </div>
                        </div>
                    </EscapeOutside>
                </div>
                <div className="page-padding-bottom"/>

                {localStorage.getItem('userRole') === "ROLE_ADMIN" && false? (
                    <React.Fragment>
                        <br/>
                        <br/>
                        <br/>
                        <div><h2>Add User</h2></div>
                        <br/>
                        <Row>
                            <Col>
                                <Form.Control type="text" title="name" placeholder="name"  onChange={e => {this.setState({newUserName: e.target.value })}}/>
                            </Col>
                            <Col>
                                <Form.Control type="password" title="Password" placeholder="password"  onChange={e => {this.setState({newUserPassword: e.target.value })}}/>
                            </Col>
                            <Col>
                                <Form.Control type="text" title="repeatPassword" placeholder="repeat password"  onChange={e => {this.setState({newUserRepeatPassword: e.target.value })}}/>
                            </Col>
                            <Col>
                                <Form.Control as="select" title="user role" name="user role" value={this.state.newUserRole}
                                              className="select-right"
                                              onChange={ (e) => this.setState({ newUserRole: e.target.value })}>
                                    {this.state.newUserRoles.map((idx, e) => (
                                        <option key={e} value={idx.value}>
                                            {idx.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col>
                                <Button className="btn-tDefault" onClick={() => {this.addUser()}}>Speichern</Button>
                            </Col>
                        </Row>
                        <br/>
                        <Row className="row-newUser-warning">
                            <Col>
                                {this.state.stateNewUser === "success" ? (
                                    <div className="alert alert-success" role="alert">
                                        Ein neuer User, {this.state.newUserName}, wurde hinzugefügt.
                                    </div>
                                ) : this.state.stateNewUser === "error" ? (
                                    <div className="alert alert-danger" role="alert">
                                        Hinzufügen eines neuen Users ist fehlgeschlagen.
                                    </div>
                                ) : null }
                            </Col>
                        </Row>
                        <br/>
                    </React.Fragment>
                ) : null }
            </div>
        );
    }
}
