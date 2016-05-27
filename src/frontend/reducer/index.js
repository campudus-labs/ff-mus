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

    const initState = reducerMaps[reducerName].initialState;
    if (!initState) {
      throw new Error(`reducer ${reducerName} did not set initialState.`);
    }

    initialState[reducerName] = initState;

    Object.keys(currentReducerMap).forEach((actionType) => {
      const oldActions = reducerMap[actionType];
      if (oldActions) {
        reducerMap[actionType] = (state, action) => {
          const currentState = oldActions(state, action);
          return {
            ...currentState,
            [reducerName] : currentReducerMap[actionType](currentState[reducerName], action)
          };
        };
      } else {
        reducerMap[actionType] = (state, action) => {
          return {
            ...state,
            [reducerName] : currentReducerMap[actionType](state[reducerName], action)
          };
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
  return (state = initialState, action) => {
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
export const initialRootState = reducer((function () {
}()), {});

