import ActionTypes from './actionTypes';

export function login(username, password) {
  return {
    type : ActionTypes.TRY_LOGIN,
    username,
    password
  };
}

export function setAccount(username, id) {
  return {
    type : ActionTypes.SET_ACCOUNT,
    username,
    id
  };
}
