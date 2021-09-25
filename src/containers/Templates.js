import React, { Component } from "react";
import "./Templates.sass";

import AddCustomer from "./components/AddCustomer";
import ChangeDefaultTexts from "./components/ChangeDefaultTexts";
import CustomersMask from "./components/CustomersMask";

export default class Templates extends Component {
    state = {
        reloadAddCustomer: false
    }

    handleLoadCustomersAndSelect = () => {
        this.setState({
            reloadAddCustomer: true
        })
        this.resetReload()
    }
    resetReload = () => {
        this.setState({
            reloadAddCustomer: false
        })
    }

    render() {
        return (
            <div id="templates" className="Templates page-content">
                <ChangeDefaultTexts isActive={true} positonLeft={false}/>
                <AddCustomer isActive={true} submitHandler={this.handleLoadCustomersAndSelect} reloadCustomers={() => this.props.reloadCustomers()}/>
                <div className="col-pageHeader"><h2 className="pageHeader">Vorlagen</h2></div>
                <br/>
                <br/>
                { this.props.customers && (
                    <CustomersMask customers={this.props.customers} reloadCustomers={() => {
                        this.props.reloadCustomers()
                    }} reload={this.state.reloadAddCustomer}/>
                )}
                <div className="page-padding-bottom"/>
            </div>
        );
    }
}
