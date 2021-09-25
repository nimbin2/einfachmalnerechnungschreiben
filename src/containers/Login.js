import React from 'react';
import "./Login.sass"

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import LoginApi from '../apis/Login';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";


class Login extends React.Component {

    state = {
        username: '',
        password: '',
        error: false,
        serverError: false,
        success: false,
        loadScreen: false,
        login: true

    };

    componentDidMount() {
        window.loadScreen = null;
        localStorage.removeItem("bearertoken");
    }


    authenticate = (e) => {
        e.preventDefault();
        this.setState({error: false, loadScreen: true});
        LoginApi.authenticate(this.state.username, this.state.password).then((response) => {
            if(response.status === 200) {
                localStorage.setItem('bearertoken', response.data.access_token);
                localStorage.setItem('userRole', response.data.roles);
                this.props.history.push('/');
                this.setState({
                    loadScreen: false,
                    success: true,
                    login: false
                });
            }
        }).catch(() => this.setState({ error: true, loadScreen: false }))
    };




    render() {
        return (
            <div className="LoginAuthentication">
                <div className={`loadScreen ${!this.state.loadScreen ? "d-none" : ""}`}><FontAwesomeIcon icon={faSpinner}/></div>
                <div className="page">
                    <h2 className="login-header mb-4">Login</h2>
                    <div className="form-container">
                        {this.state.login ? (
                            <Form onSubmit={() => this.authenticate()}>
                                <FormGroup>
                                    <Form.Control className="input-field" type="text" value={this.state.username}
                                                  onChange={(e) => this.setState({username: e.target.value, error: false})}
                                                  placeholder="Benutzername"/>
                                </FormGroup>
                                <FormGroup className="mb-0">
                                    <Form.Control className="input-field" value={this.state.password}
                                                  type="password"
                                                  onChange={(e) => this.setState({password: e.target.value, error: false})}
                                                  placeholder="Passwort"/>
                                </FormGroup>

                                <br/>

                                <div className="position-relative">
                                    <Button className="btn-tDefault btn-active" disabled={this.state.username === "" || this.state.password === ""} onClick={(e) => this.authenticate(e)} type="submit">Login</Button>
                                    <Button className="btn-linkText" onClick={() => this.props.history.push("register")} disabled={this.state.serverError}>registrieren</Button>
                                </div>
                            </Form>
                        ) : null}
                        {this.state.error ? (
                            <div className="alert alert-danger">
                                Passwort und Benutzername stimmen nicht überein.
                            </div>
                        ) : null}
                        {this.state.serverError ? (
                            <div className="alert alert-danger alert-serverError">
                                Der Server scheint offline zu sein.
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
