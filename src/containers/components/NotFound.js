import React, {Component} from "react";
import "./NotFound.sass";

export default class NotFound extends Component {
    state = {
        errorDescription: "",
        errorDetail: "",
    }
    render() {
        return (
            <div className="NotFound">
                <h2 className="text-danger">Sorry, there is an Error.</h2>
                <br/>
                <h3 className="text-danger">{this.state.errorDescription}</h3>
            </div>
        )
    }
};
