import React, {Component} from "react";
import {Route} from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import CreateUpdateEmployee from "./components/CreateUpdateEmployee";
import ManageEmployees from "./components/ManageEmployees";
import Configuration from "./components/Configuration";


export default class App extends Component {
    render() {
        return (
            <Layout>
                <Route exact path="/" component={Home}/>
                <Route exact path="/create-update-employee" component={CreateUpdateEmployee}/>
                <Route path="/create-update-employee/:employeeIdParam" component={CreateUpdateEmployee}/>
                <Route path="/manage-employees" component={ManageEmployees}/>
                <Route path="/configuration" component={Configuration}/>
            </Layout>
        );
    }
}
