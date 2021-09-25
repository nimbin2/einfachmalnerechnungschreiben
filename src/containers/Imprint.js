import React, { Component } from "react";
import "./Templates.sass";
import history from "../history";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default class Imprint extends Component {

    render() {
        return (
            <div id="imprint" className="page page-imprint">
                <div className="col-pageHeader">
                    <button className="btn-legalsBack btn-white-blue" onClick={() => !localStorage.getItem('bearertoken') ? history.push("/login") : history.push("/")}><FontAwesomeIcon icon={faChevronLeft}/></button>
                    <h2 className="pageHeader">Impressum</h2>
                </div>
                <br/>
                <br/>
                <div>Christian Immanuel Fischer</div>
                <div>Teterower Ring 110</div>
                <div>12619 Berlin</div>
                <br/>
                <div><a href="mailto:mail@christianimmanuel.de">mail@christianimmanuel.de</a></div>
                <div>0151 644 045 31</div>
                <br/>
                <br/>
            </div>
        );
    }
}
