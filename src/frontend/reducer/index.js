import Immutable from 'immutable';
import canvas from './canvasReducer';
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

export function combineReducerMapsToReducerMap(reducerMaps) {
  const reducerMap = {};
  const initialState = {};

  if (!reducerMaps) {
    throw new Error('no reducers given');
  }
  const keyList = Object.keys(reducerMaps);
  if (keyList.length <= 0) {
    throw new Error('no reducers given');
  }
  keyList.forEach((reducerName) => {
    const currentReducerMap = reducerMaps[reducerName].reducerMap;
    if (!currentReducerMap) {
      throw new Error('no reducerMap given');
    }

    let initState = reducerMaps[reducerName].initialState;
    if (!initState) {
      throw new Error(`reducer ${reducerName} did not set initialState.`);
    }
    if (!(initState instanceof Immutable.Map)) {
      initState = Immutable.Map(initState);
    }

    initialState[reducerName] = initState;
    Object.keys(currentReducerMap).forEach((actionType) => {
      const oldActions = reducerMap[actionType];
      if (oldActions) {
        reducerMap[actionType] = (state, action) => {
          const currentState = oldActions(state, action);
          return currentState.update(reducerName, (oldState) => currentReducerMap[actionType](oldState, action));
        };
      } else {
        reducerMap[actionType] = (state, action) => {
          return state.update(reducerName, (oldState) => currentReducerMap[actionType](oldState, action));
        };
      }
    });

  });

  return {
    reducerMap,
    initialState
  };
}

export function combineReducerMapsToReducer(reducerMaps) {
  const {initialState, reducerMap} = combineReducerMapsToReducerMap(reducerMaps);

  return reducerFromStateAndMap(initialState, reducerMap);
}

export function combineReducerMapToReducer(reducerStateAndMap) {
  return reducerFromStateAndMap(reducerStateAndMap.initialState, reducerStateAndMap.reducerMap);
}

export function reducerFromStateAndMap(initialState, reducerMap) {
  return (state = Immutable.Map(initialState), action) => {
    if (!action) {
      return state;
    }
    const actionFn = reducerMap[action.type];
    if (actionFn) {
      return actionFn(state, action);
    } else {
      return state;
    }
  };
}

const reducer = combineReducers({
  app : combineReducerMapsToReducer({canvas}),
  routing : routerReducer
});

export default reducer;
