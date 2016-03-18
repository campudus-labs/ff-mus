import ActionTypes from './actionTypes';

export function setCanvasLayout(payload) {
  return {
    type : ActionTypes.SET_CANVAS_LAYOUT,
    payload
  };
}
