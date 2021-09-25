import React, {Component} from 'react';

import Button from "react-bootstrap/Button";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class MissingStuff extends Component {

    state = {
        isLoaded: false
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.setState({
                isLoaded: true
            })
        }, 1000)
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isLoaded && (
                    <div className="missingStuff alert alert-warning">
                        <div className="missingStuff-user">
                            Es fehlen ein paar Daten.<br/>
                            In deinem Profil kannst sie ergänzen.
                        </div>
                        <Button onClick={() => this.props.forwardPage("user")} className="btn-noStyle">zum Profil&nbsp;<FontAwesomeIcon icon={faArrowRight}/></Button>
                    </div>
                )}
            </React.Fragment>
        )
    }
}
