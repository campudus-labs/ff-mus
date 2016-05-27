import ActionTypes from './actionTypes';
import 'file!./../vendor/sockjs-0.3.4.min.js';
// import EventBus from './../vendor/vertx-eventbus.js';

const incoming = 'mus.game.in';
const outgoing = 'mus.game.out';

export function setCanvasLayout(payload) {
  return {
    type : ActionTypes.SET_CANVAS_LAYOUT,
    payload
  };
}

export function userClick(number, color) {
  return {
    type : ActionTypes.USER_CLICK,
    number : number,
    color : color
  };
}

export function userJoin(id, name, color) {
  return {
    type : ActionTypes.USER_JOIN,
    id : id,
    name : name,
    color : color
  };
}

export function login() {
  return {
    type : ActionTypes.LOGIN
  }
}

export function setMyUserId(id) {
  return {
    type : ActionTypes.SET_MY_USER_ID,
    id : id
  }
}

export function loginFailed(error) {
  return {
    type : ActionTypes.LOGIN_FAILED,
    error : error
  }
}

export function loginSuccess(payload) {
  return (dispatch) => {
    const {id,name,color} = payload.body.payload;

    dispatch({
      type : ActionTypes.LOGIN_SUCCESS,
      ...payload.body.payload
    });

    //generate my user object
    dispatch(userJoin(id, name, color));

    //simulate all other events


  };
}

// export function loginRequest(replyHandler) {
//   return (dispatch) => {
//     dispatch({
//       type : ActionTypes.LOGIN_REQUEST
//     });
//
//     const eb = new EventBus('http://10.10.2.45:8080/eventbus');
//     eb.onopen = function () {
//       // set a handler to receive a message
//       eb.registerHandler(outgoing, function (error, message) {
//       });
//
//       // send a message
//       eb.send(incoming, {type : 'LOGIN'}, replyHandler);
//     };
//   }
// }
