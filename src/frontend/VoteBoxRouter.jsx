import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import FaqScreen from './components/FaqScreen.jsx';

export default function createVoteBoxRouter(store) {
  const history = syncHistoryWithStore(browserHistory, store);
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="login" component={LoginScreen}/>
        <Route path="faq" component={FaqScreen}/>
      </Route>
    </Router>
  );
}
