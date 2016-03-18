import './index.html';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import createVoteBoxRouter from './VoteBoxRouter';

const store = configureStore();
const VoteBoxRouter = createVoteBoxRouter(store);

ReactDOM.render(
  <Provider store={store}>
    {VoteBoxRouter}
  </Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'development') {
  const showDevTools = require('./showDevTools').default;
  showDevTools(store);
}
