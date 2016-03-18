import { expect } from 'chai';
import { Map } from 'immutable';
import { reducerFromStateAndMap } from './index';
import accountReducer from './accountReducer';
import { login, setAccount } from '../actions/actionCreators';

describe('The account reducer', () => {
  const {initialState, reducerMap} = accountReducer;
  const reducer = reducerFromStateAndMap(initialState, reducerMap);

  it('is not logged in at startup and does not try to do so', () => {
    expect(reducer(initialState).toJS()).to.deep.equals({
      isLoggedIn : false,
      isLoggingIn : false
    });
  });

  it('can try to login', () => {
    expect(reducer(Map({isLoggedIn : false, isLoggingIn : false}), login('alice', 'secret')).toJS()).to.deep.equals({
      isLoggedIn : false,
      isLoggingIn : true
    });
  });

  it('can be logged in', () => {
    expect(reducer(Map({isLoggedIn : false, isLoggingIn : true}), setAccount('alice', 1)).toJS()).to.deep.equals({
      isLoggedIn : true,
      isLoggingIn : false,
      username : 'alice',
      id : 1
    });
  });

});
