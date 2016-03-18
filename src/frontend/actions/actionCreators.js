import ActionTypes from './actionTypes';

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
