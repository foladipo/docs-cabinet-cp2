import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';
import DashboardContainer from './DashboardContainer';
import AuthenticationPage from './AuthenticationPage';

export default function RootContainer() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={AuthenticationPage} />
        <AuthenticatedRoute exact path="/dashboard" component={DashboardContainer} />
      </Switch>
    </BrowserRouter>
  );
}
