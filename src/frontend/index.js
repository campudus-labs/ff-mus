import './index.html';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import createVoteBoxRouter from './VoteBoxRouter';
import {loginRequest, loginFailed, loginSuccess} from './actions/actionCreators';

const store = configureStore();
const VoteBoxRouter = createVoteBoxRouter(store);

ReactDOM.render(
  <Provider store={store}>
    {VoteBoxRouter}
  </Provider>,
  document.getElementById('root')
);

const handleServerReply = (error, payload) => {
  console.log("handleServerReply:", error, payload);
  if (error) {
    store.dispatch(loginFailed(error));
  } else {
    store.dispatch(loginSuccess(payload));
  }
};

//Login to server
// store.dispatch(loginRequest(handleServerReply));

if (process.env.NODE_ENV === 'development') {
  const showDevTools = require('./showDevTools').default;
  showDevTools(store);
}
