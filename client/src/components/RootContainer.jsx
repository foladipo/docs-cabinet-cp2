import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';
import DashboardContainer from './DashboardContainer';
import LoginContainer from './LoginContainer';

export default function RootContainer() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginContainer} />
        <AuthenticatedRoute exact path="/dashboard" component={DashboardContainer} />
      </Switch>
    </BrowserRouter>
  );
}
