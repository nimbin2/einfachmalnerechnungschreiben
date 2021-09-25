import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from "./Routes";
import AxiosHelper from './config/axiosHelper'
import history from './history'

export default class App extends Component {
    constructor(props) {
        super(props);
        AxiosHelper.init();
    }
    render() {
        return (
            <div className="App">
                <Routes/>
                <button onClick={() => history.push("/imprint")} className="btn-imprint btn-noStyle">Impressum</button>
                <button onClick={() => history.push("/privacy")} className="btn-privacy btn-noStyle">Datenschutz</button>
            </div>
        );
    }
}
