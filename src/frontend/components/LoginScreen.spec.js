import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import LoginScreen from './LoginScreen';
import { expect } from 'chai';
import configureStore from '../store/configureStore';
import jsdom from 'mocha-jsdom';

describe('LoginScreen', () => {
  jsdom();

  it('has username and password input fields', () => {
    const store = configureStore();
    const renderedComponent = ReactTestUtils.renderIntoDocument(<LoginScreen store={store}/>);
    const inputElements = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent, 'input');
    expect(inputElements.map(e => e.name)).to.contain('username');
    expect(inputElements.map(e => e.name)).to.contain('password');
  });

  it('dispatches a TRY_LOGIN on submit', (done) => {
    const store = configureStore();
    const unsubscribe = store.subscribe(() => {
      expect(store.getState().account.getIn(['isLoggingIn'])).to.equal(true);
      unsubscribe();
      done();
    });
    const renderedComponent = ReactTestUtils.renderIntoDocument(<LoginScreen store={store}/>);
    const form = ReactTestUtils.findRenderedDOMComponentWithTag(renderedComponent, 'form');
    ReactTestUtils.Simulate.submit(form);
  });

});
