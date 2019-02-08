import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from './reducers';

// enable redux devtool chrome extension
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

// add the react-router-redux reducer to store on the `router` key
// also apply our middleware for navigating
export const history = createBrowserHistory();

const initialState = {};

// create the store
const store = createStore(
  createRootReducer(history), // root reducer with router state
  initialState,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
    ),
  ),
);

export default store;
