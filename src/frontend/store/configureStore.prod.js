import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from './promiseMiddleware';
import reducer from '../reducer';

// Middleware you want to use in production:
const enhancer = applyMiddleware(thunk, promiseMiddleware);

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  return createStore(reducer, initialState, enhancer);
}
