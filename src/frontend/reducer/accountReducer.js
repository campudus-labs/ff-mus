import ActionTypes from '../actions/actionTypes';
import { Map } from 'immutable';

const initialState = Map({
  isLoggedIn : false,
  isLoggingIn : false
});

const reducerMap = {
  [ActionTypes.TRY_LOGIN] : (state) => state.update('isLoggingIn', () => true),
  [ActionTypes.SET_ACCOUNT] : (state, data) => {
    return state.merge({
      isLoggingIn : false,
      isLoggedIn : true,
      username : data.username,
      id : data.id
    });
  }
};

export default {
  initialState,
  reducerMap
};
