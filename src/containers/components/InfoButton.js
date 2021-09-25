import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import EscapeOutside from "react-escape-outside";
import {faInfo} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default class InfoButton extends Component {
    state = {
        infoOn: false,
        positionInfo: "10px",
        reloadPosition: true,
        infoText:
            this.props.infoClass === "selectUstrSetting" ?
            'Hiermit wählst du aus wie häufig du deine Umsatzssteuervoranmeldung machen musst. Im berreich "Steuer" kannst du zur Überprüfung den jeweiligen Zeitraum abhaken. Am gelben Balken in der ersten Tabellenzeile siehst du, wie lang es noch bis zur nächsten Voranmeldung ist.' :
            this.props.infoClass === "infoDefaultText" ?
            'Dies sind die Standarttexte deiner Rechnung. In den jeweiligen Texten kannst du über  die Variable $UNTERNEHMEN den Namen des Unternehmens, über $ANSPRECHPARTNER den Ansprechpartner ausgeben lassen. Beim bearbeiten eines Partners kannst du im erweitertem Berreich individuelle Texte anlegen.' :
            this.props.infoClass === "adBillNumber" ?
            'Hier steht deine Rechnungsnummer. Du kannst die Logik für die Generierung in deinem Profil ändern. Bei fehlerhafter Logik wird automatisch die letzte Rechnungsnummer + 1 gewählt.' :
            this.props.infoClass === "checkUstrInfo" ?
            'Hier kannst du, immer wenn du deine Umsatzsteuervoranmeldung gemacht hast, ein häkchen setzen. In deinem Profil kannst du das Zeitintervall ändern. Mit drücken auf "USt." kannst du die einzelnen Spalten bearbeiten. ' :
            this.props.infoClass === "billLogic" ?
            'Hier kannst du eingeben wie sich deine Rechnungsnummer zusammensetzen soll.\nMögliche Eingaben sind entweder ein + und eine Zahl oder ein Datum das sich aus den Buchstaben Y M D H m s generieren lässt (Year, Month, Day,..).\nSollte deine eingegebene Logik nich mit einer höheren Rechnungsnummer als die Vorherige enden, wird der Wert durch +1 ersetzt.\nBeispiele:\n+1                           1..2..3..4\nYYMMDDhhmmss    21031540\nYYYYMMDDhhmm   20210315\n' :
            ""
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.setState({
                reloadPosition: false
            })
        }, 350)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.reload !== this.props.reload) {
            this.setState({
                reloadPosition: !this.state.reloadPosition
            })
            window.setTimeout(() => {
                this.setState({
                    reloadPosition: !this.state.reloadPosition
                })
            }, 350)
        }
    }

    handleEscapeOutside = () => {
        if (this.state.infoOn) {
            if (this.props.dontBlur !== true ) {
                document.body.classList.remove('blur-page')
            }
            this.setState({ infoOn: false })
        }
    }

    render() {
        return (
            <div>
                <EscapeOutside onEscapeOutside={ () => this.handleEscapeOutside()} className={!this.state.infoOn ? "d-none" : ""}><div/></EscapeOutside>

                <Button className={`btn-info ${this.state.infoOn ? "d-none" : ""} ${this.props.hide ? "d-none" : ""}`}
                        style={{
                            opacity: this.state.reloadPosition ? "0" : "1",
                            top: document.getElementById(this.props.infoClass) ? `${document.getElementById(this.props.infoClass).offsetTop}px` : "0",
                            left: document.getElementById(this.props.infoClass) ? `${ (document.getElementById(this.props.infoClass).offsetWidth - 19) }px` : "0"
                        } }
                    onClick={() => {
                        !this.props.dontBlur && document.body.classList.add('blur-page')
                        this.setState({infoOn: true})
                    }}><FontAwesomeIcon icon={faInfo}/></Button>
                <div className={`card card-info ${!this.state.infoOn ? "d-none" : ""} ${this.props.setLeft ? "setLeft" : ""}`}
                     style={{
                         top: document.getElementById(this.props.infoClass) ? `${document.getElementById(this.props.infoClass).offsetTop-3}px` : "0",
                         left: document.getElementById(this.props.infoClass) ? `${document.getElementById(this.props.infoClass).offsetWidth+5}px` : "0"
                     } }>
                    <div className="card-body">
                        {this.state.infoText}
                    </div>
                </div>
            </div>
        );
    }
}
