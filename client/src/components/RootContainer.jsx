import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';
import DashboardContainer from './DashboardContainer';
import AuthenticationPage from './AuthenticationPage';
import NotFound from './NotFound';

/**
 * AuthenticationPage - Renders the entirety of this app.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
export default function RootContainer() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={AuthenticationPage} />
        <AuthenticatedRoute path="/dashboard*" component={DashboardContainer} />
        <AuthenticatedRoute exact path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
