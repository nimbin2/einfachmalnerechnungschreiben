import React, {Component, Fragment} from "react";
import "./MapPages.sass";
import PageBills from "./Bills";
import PageAddBill from "./AddBill";
import MissingStuff from "./components/MissingStuff";
import PageTemplates from "./Templates";
import PageTax from "./Tax";
import PageUser from "./User";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from 'react-bootstrap/Form';
import history from "../history";
import Api from "../Api";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faPen,
    faPlus,
    faUser,
    faSignOutAlt,
    faChevronDown,
    faBook,
    faFolderOpen,
    faTasks,
    faCalculator,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";
import EscapeOutside from "react-escape-outside";
import moment from "moment";


export default class MapPages extends Component {

    state = {
        user: [],
        bills: [{}],
        result: "",
        calcString: "",
        lastCustomer: [],
        notes: "",
        disableNotes: false,
        showNotes: false,
        userDataError: false,
        toggleCalc: false,
        updateNotes: true,
        loadedBills: false,
        loadedCustomers: false,
        loadedTax: false,
        loadedUser: false,
        loadScreen: false,
        scrollTo: "hidden",
        taxCalcStringJ: "",
        taxCalcStringQ: "",
        taxCalcStringM: ""
    }


    componentDidMount() {
        window.loadScreen = true
        !localStorage.getItem("bearertoken") && history.push("/login")
        this.loadUser();
    }

    loadUser = () => {
        this.setState({
            loadScreen: true
        })
        Api.getUser().then((response) => {
            let data = response.data
            let userDataError = false
            console.log("huu", data)
            Object.entries(data).forEach((item) => {
                if (!item[1]) {
                    userDataError = true
                }
            });

            this.setState({
                user: data,
                userDataError: userDataError,
                loadScreen: false,
                loadedUser: true
            });

            this.getUserNotes();
            this.updateBills();
            this.getLastActivePage();
            this.loadCustomers();
        })
    };

    getLastActivePage = () => {
        Api.getLastActivePage().then((response) => {
            this.setState({
                activePage: response.data.lastActivePage
            });
        })
    };

    updateBills = () => {
        window.loadScreen = true
        this.setState({
            loadedBills: false
        });
        Api.getBills().then((response) => {
            let data = response.data
            if (data.length > 0) {
                this.setState({
                    bills: data,
                    startYear: moment.min(data.map((el) => moment(el.billDate))).format('YYYY') || "",
                    loadedBills: true
                });
            } else {
                this.setState({
                    bills: null,
                    startYear: null,
                    loadedBills: true
                });
            }
            this.getTax()
        })
    };

    loadCustomers = () => {
        window.loadScreen = true
        Api.getCustomers().then((response) => {
            window.loadScreen = false
            this.setState({
                customers: response.data,
                loadedCustomers: true
            });
        })
    };

    handleGetPage = (activePage) => {
        Api.updateLastActivePage(activePage)
        this.setState({
            activePage: activePage,
            scrollTo: "hidden"
        }) && window.scrollTo(0, 0);
        if (activePage === "bills") {

        }
    }

    calculate = (event) => {
        this.setState({calcString: event.target.value.replace(',','.')})
        window.setTimeout(() => {
            try {
                this.setState({
                    // eslint-disable-next-line
                    result: (eval(this.state.calcString).toFixed(2) || "" ) + ""
                })
            } catch (e) {
                this.setState({
                    result: "error"
                })
            }
        }, 100);
    };

    copyCodeToClipboard = (copyText) => {
        function copyToClipboard(text) {
            var dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
        }
        copyToClipboard(copyText)
    }

    getUserNotes = () => {
        Api.getUserNotes().then((response) => {
            this.setState({notes: response.data.notes})
        })
    }

    changeUserNotes = (e) => {
        this.setState({notes: e.target.value ? e.target.value : "$NULL"})
    }

    handleEscapeOutsideNotes = () => {
        if (this.state.showNotes) {
            let notes = this.state.notes ? this.state.notes : "$NULL"
            Api.updateUserNotes(notes)
            document.body.classList.remove('blur-page')
            this.setState({ showNotes: false, disableNotes: false })
        }
    }



    getTax = () => {
        window.loadScreen = this.state.activePage === "tax" && true
        let startAndEndDatesJ = []
        let startAndEndDatesQ = []
        let startAndEndDatesM = []
        let positionJ = 0
        let positionQ = 0
        let positionM = 0
        let taxCalcStringJ
        let taxCalcStringQ
        let taxCalcStringM

        for ( let i = this.state.startYear; i <= new Date().getFullYear(); i++) {
            startAndEndDatesJ.push({position: positionJ, startDate: moment("01.01." + i, "DD.MM.YYYY").toDate(), endDate: moment("01.01." + i, "DD.MM.YYYY").add(1, 'year').add(-1, 'second').toDate()})
            positionJ++
        }
        for ( let i = moment("01.01." + this.state.startYear, "DD.MM.YYYY"); i <= new Date(); i = i.add(3, 'month')) {
            startAndEndDatesQ.push({position: positionQ, startDate: i.toDate(), endDate: i.clone().add(3, 'month').add(-1, 'second').toDate()})
            positionQ++
        }
        for ( let i = moment("01.01." + this.state.startYear, "DD.MM.YYYY"); i <= new Date(); i = i.add(1, 'month')) {
            startAndEndDatesM.push({position: positionM, startDate: i.toDate(), endDate: i.clone().add(1, 'month').add(-1, 'second').toDate()})
            positionM++
        }
        Api.getTaxCalculation(startAndEndDatesJ).then((response) => {
            taxCalcStringJ = response.data
            Api.getTaxCalculation(startAndEndDatesQ).then((response) => {
                taxCalcStringQ = response.data
                Api.getTaxCalculation(startAndEndDatesM).then((response) => {
                    taxCalcStringM = response.data
                    window.loadScreen = false

                    this.setState( {
                        loadedTax: true,
                        taxCalcStringJ: taxCalcStringJ,
                        taxCalcStringQ: taxCalcStringQ,
                        taxCalcStringM: taxCalcStringM
                    })
                })
            })
        })
    };


    render() {
        return (
            <Fragment>
                <Navbar fixed="top" id="NavBar">
                    <Nav className="mr-auto">
                        <Nav.Link disabled={this.state.activePage === "tax" || !this.state.bills} className={`nav-link-tax ${!this.state.bills && "active"} ${this.state.activePage  === "tax" ? "active" : ""}`} onClick={() => this.handleGetPage("tax")}>
                            <div className="d-md-inline d-none">Steuer</div><div className="d-md-none"><FontAwesomeIcon icon={faBook}/></div></Nav.Link>
                        <Nav.Link disabled={this.state.activePage === "bills" || !this.state.bills} className={`nav-link-bills ${!this.state.bills && "active"} ${this.state.activePage  === "bills" ? "active" : ""}`} onClick={() => this.handleGetPage("bills")}>
                            <div className="d-md-inline d-none">Rechnungen</div><div className="d-md-none"><FontAwesomeIcon icon={faFolderOpen}/></div></Nav.Link>
                        <Nav.Link disabled={this.state.activePage === "addBill"} className={`nav-link-addBill btn-white-blue ${this.state.activePage  === "addBill" ? "active" : ""}`} onClick={() => this.handleGetPage("addBill")} title="Rechnung hinzufügen"><FontAwesomeIcon icon={faPlus}/></Nav.Link>
                    </Nav>
                    <Nav className="navbar-nav-middle m-auto">
                        <Button id="navBtnNotes" className="nav-link nav-link-notes btn-white-blue" disabled={this.state.disableNotes}
                                onClick={() => { this.setState({showNotes: !this.state.showNotes, disableNotes: true}); document.body.classList.add('blur-page') }} title="Notizen"><FontAwesomeIcon icon={faPen}/></Button>
                        <Button className="nav-link nav-link-calcBtn btn-white-blue d-md-none" onClick={() =>this.setState({toggleCalc: !this.state.toggleCalc})}><FontAwesomeIcon icon={faCalculator}/></Button>
                        <div className={`nav-link-calc p-0 d-none d-md-inline ${this.state.toggleCalc ? "d-inline" : "d-none "}`}><Form.Control value={this.state.calcString} title="Rechner (+,-,/,*,...)" placeholder="Rechner" onChange={this.calculate.bind(this)}/></div>
                        <Nav.Link className={`nav-link-calcResult cursorCopy ${this.state.toggleCalc ? "d-inline" : "d-none s-md-inline "}`} onClick={() => this.copyCodeToClipboard(this.state.result.replace('.',','))}>&nbsp;{this.state.result.replace('.',',')}</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link disabled={this.state.activePage === "templates"} className={`nav-link-templates btn-white-blue ${this.state.activePage  === "templates" ? "active" : ""}`} onClick={() => this.handleGetPage("templates")}>
                            <div className="d-lg-inline-block d-none">Vorlagen</div><div className="d-lg-none"><FontAwesomeIcon icon={faTasks}/></div></Nav.Link>
                        <Nav.Link disabled={this.state.activePage === "user"} className={`nav-link-user btn-white-blue ${this.state.activePage === "user" ? "active" : ""}`} onClick={() => this.handleGetPage("user")}><FontAwesomeIcon icon={faUser}/></Nav.Link>
                        <Nav.Link className="nav-link-logout" onClick={() => {
                            history.push('/logout')
                        }}><FontAwesomeIcon icon={faSignOutAlt}/></Nav.Link>
                    </Nav>
                </Navbar>

                <EscapeOutside onEscapeOutside={ this.handleEscapeOutsideNotes.bind(this)}
                               style={{zIndex: this.state.showNotes ? 110 : 1 }}>
                    <Form.Control as="textarea" rows="1" title="Deine Notizen"
                                  className={`${this.state.showNotes ? "d-inline-block" : "d-none"} position-fixed notes`}
                                  style={{left: document.getElementById("navBtnNotes") ? `${document.getElementById("navBtnNotes").offsetLeft+2}px` : "0"}}
                                  placeholder="Notizen"
                                  name="userNotes"
                                  value={this.state.notes === "$NULL" ? "" : this.state.notes}
                                  onChange={(e) => { this.changeUserNotes(e) }}/>
                </EscapeOutside>

                <Container className="container-hideScroll"><div className="hideScroll"/></Container>
                <div className={`loadScreen ${!window.loadScreen ? "d-none" : ""}`}><FontAwesomeIcon icon={faSpinner}/></div>

                {this.state.user && (
                    <Container className={`page page-`+this.state.activePage} >
                        <div className="page-blur" id="pageBlure"/>
                        {this.state.activePage === "bills" && this.state.loadedBills ? ( <PageBills user={this.state.user} customers={this.state.customers} bills={this.state.bills} reloadBills={() => { this.updateBills()
                        }}/> ) : null}
                        {this.state.activePage === "tax" && this.state.loadedTax ? (<PageTax bills={this.state.bills} taxUstrCheck={this.state.user.taxUstrCheck} taxCalcStringJ={this.state.taxCalcStringJ} taxCalcStringQ={this.state.taxCalcStringQ} taxCalcStringM={this.state.taxCalcStringM}/>) : null}
                        {this.state.activePage === "addBill" && this.state.user && this.state.loadedCustomers && !this.state.userDataError ? (
                            <PageAddBill
                                         user={this.state.user}
                                         customers={this.state.customers}
                                         bills={this.state.bills}
                                         loadCustomers={() => this.loadCustomers()}
                                         forwardPage={(e) => {
                                            this.updateBills();
                                            this.handleGetPage(e, ["bills"])
                                        }}/>
                            ) : (
                            <Fragment>
                                {this.state.userDataError && this.state.activePage === "addBill" ? (
                                    <MissingStuff forwardPage={(e) => {
                                        this.loadUser();
                                        this.handleGetPage([e])
                                    }}/>
                                ) : null}
                            </Fragment>
                        )}
                        {this.state.activePage === "templates" && this.state.loadedCustomers ? (<PageTemplates customers={this.state.customers} reloadCustomers={() => {
                            this.loadCustomers()
                        }}/>) : null}
                        {this.state.activePage === "user" && this.state.user && this.state.loadedBills ? (<PageUser bills={this.state.bills} user={this.state.user} loadUser={() => this.loadUser()}/>) : null}
                        {this.state.scrollTo === "down" ? (
                            <Button className="scrollPage btn-noStyle" onClick={() => this.scrollTo()}><FontAwesomeIcon icon={faChevronDown}/></Button>
                        ) : null }
                    </Container>
                )}
                <br/>
                <br/>
            </Fragment>
        )
    }
}
