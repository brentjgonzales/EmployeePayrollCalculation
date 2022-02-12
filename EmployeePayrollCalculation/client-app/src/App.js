import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { CreateEmployee } from './components/CreateEmployee';


export default class App extends Component {
  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/create-employee' component={CreateEmployee} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
  }
}
