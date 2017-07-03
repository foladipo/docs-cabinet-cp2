import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';
import DashboardContainer from './DashboardContainer';
import AuthenticationContainer from './AuthenticationContainer';
import NotFound from './NotFound';

/**
 * RootComponent - Renders the entirety of this app.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
export default function RootComponent() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={AuthenticationContainer} />
        <AuthenticatedRoute path="/dashboard*" component={DashboardContainer} />
        <AuthenticatedRoute exact path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
