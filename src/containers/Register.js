import React from 'react';
import "./Login.sass"
import history from '../history'

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Api from "../Api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faSpinner} from "@fortawesome/free-solid-svg-icons";


class Register extends React.Component {

    state = {
        errors: {},
        name: '',
        password: '',
        repeatPassword: '',
        privacyCheck: false,
        error: false,
        success: false,
        loadScreen: false,
        login: true
    };

    registerUser = () => {
        this.setState({loadScreen: true})
        let isValid = true
        let errors = {}
        if (!this.state.name) {
            isValid = false;
            errors["name"] = "Bitte gib einen gültigen Benutzernamen ein.";
        }
        if (this.state.password.length < 6) {
            isValid = false;
            errors["password"] = "Das Passwort muss aus mindestens 6 Zeichen bestehen.";
        } else if (this.state.password !== this.state.repeatPassword) {
            isValid = false;
            errors["password"] = "Die Passwörter stimmen nicht überein.";
        }

        isValid = this.state.privacyCheck


        if (isValid) {
            Api.addUser(this.state.name, this.state.password, this.state.repeatPassword).then((response) => {
                console.log(response)
                console.log(response.data.id)
                let userExist = response.data.id !== 0
                console.log("userExist", userExist)
                if(!userExist) {
                    errors["success"] = "Du wurdest registriert.";
                    this.setState({success: true, errors: errors, loadScreen: false})
                    isValid && window.setTimeout(() => {
                        history.push("login")
                    }, 2600)
                } else {
                    errors["username"] = "Der Benutzername ist bereits vergeben"
                }
            }).catch((error) => {
                isValid = false;
                if( error.response ){
                    if (error.response.data.error === 500) {
                        errors["username"] = "Der Benutzername ist bereits vergeben"
                    } else {
                        errors["server"] = "Es gab leider ein Server fehler, bitte versuche es später ernäut."
                    }
                }
            });
        }
        window.setTimeout(() => {
            this.setState({errors: errors, loadScreen: false})
        }, 300)
    }


    render() {
        return (
            <div id="register" className="Register">
                <div className={`loadScreen ${!this.state.loadScreen ? "d-none" : ""}`}><FontAwesomeIcon icon={faSpinner}/></div>
                <Container className="page">
                    <div className="col-pageHeader">
                        <button className="btn-legalsBack btn-white-blue" onClick={() => !localStorage.getItem('bearertoken') ? history.push("/login") : history.push("/")}><FontAwesomeIcon icon={faChevronLeft}/></button>
                        <h2 className="pageHeader">Registrieren</h2>
                    </div>
                    <Card className="card-body pt-0 pt-md-3">
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} className="mb-0 d-flex group-alert mt-4">
                                    <Form.Control type="text" title="name" placeholder="Benutzername" value={this.state.name} onChange={e => {this.setState({name: e.target.value })}}/>
                                    <Form.Label>
                                        <Form.Check onClick={() => this.setState({privacyCheck: !this.state.privacyCheck})} className="pl-0 mr-2" type="checkbox"/>
                                        Ich habe die <button className="btn-noStyle" onClick={() => history.push("/privacy")}><u>Datenschutzerklärung</u></button> gelesen und bin mit diesen einverstanden.</Form.Label>
                                </Form.Group>

                                <Form.Group as={Col} className="col-pw mb-0 mt-4">
                                    <Form.Control type="password" title="Password" placeholder="Passwort" value={this.state.password}
                                                  onChange={e => {this.setState({password: e.target.value })}}/>
                                    <Form.Control className="mb-4" type="password" title="repeatPassword" placeholder="Passwort wiederholen" value={this.state.repeatPassword}
                                                  onChange={e => {this.setState({repeatPassword: e.target.value })}}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row className="row-save" >
                                <Form.Group as={Col} className="mb-0">
                                    <Button className="accordion-save-button btn-tDefault btn-tSubmit" type="submit" onClick={(e) => {e.preventDefault(); this.registerUser(); }}>Registrieren</Button>
                                </Form.Group>
                            </Form.Row>
                            <div className="register-alerts">
                                <div className={`alert alert-danger ${!this.state.errors.name ? "d-none" : ""}`}>{this.state.errors.name}</div>
                                <div className={`alert alert-danger ${!this.state.errors.password ? "d-none" : ""}`}>{this.state.errors.password}</div>
                                <div className={`alert alert-danger ${!this.state.errors.username ? "d-none" : ""}`}>{this.state.errors.username}</div>
                                <div className={`alert alert-success ${!this.state.errors.success ? "d-none" : ""}`}><h2>{this.state.errors.success}</h2></div>
                            </div>
                        </Form>
                    </Card>
                </Container>
            </div>
        )
    }
}

export default Register
