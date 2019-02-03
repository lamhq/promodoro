import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader';

import store, { history } from './store';

import HomePage from './HomePage';

const App = () => (
  <ReduxProvider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={HomePage} exact />
      </Switch>
    </ConnectedRouter>
  </ReduxProvider>
);

export default hot(module)(App);
