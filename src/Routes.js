import React from "react";
import { Route, Switch } from "react-router-dom";
import MapPages from "./containers/MapPages";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Imprint from "./containers/Imprint";
import Privacy from "./containers/Privacy";
import NotFound from "./containers/components/NotFound";
import "./Elements.sass";

export default () =>
    <Switch>
        <Route exact path="/"
               render={(props) => (
                   <MapPages {...props}/>
               )}/>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/logout" exact component={Login} />
        <Route path="/imprint" exact component={Imprint} />
        <Route path="/privacy" exact component={Privacy} />
        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound} />

    </Switch>;
