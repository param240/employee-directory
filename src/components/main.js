import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppLayout from './layout/layout';

const Main = (props) => {
  return (
    <Switch>
      <Route path='/' component={AppLayout} />
    </Switch>
)}

export default Main;
