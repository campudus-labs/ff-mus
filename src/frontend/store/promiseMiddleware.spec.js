import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from './promiseMiddleware';

describe('promise middleware', () => {

// Middleware you want to use in production:
  const enhancer = applyMiddleware(promiseMiddleware);

  function configureStore(initialState, testReducer) {
    return createStore(testReducer, initialState, enhancer);
  }

  it('will not change anything if no promise is given', () => {
    const store = configureStore({a : 1}, (state) => state);
    store.dispatch({type : 'noop'});
    expect(store.getState().a).to.equal(1);
  });

  it('breaks if promise given but not a real promise', () => {
    const store = configureStore({a : 1}, (state) => state);
    expect(() => store.dispatch({type : 'increment', promise : 'foo'})).to.throw(/invalid promise given/);
  });

  it('dispatches a request event before it fulfills', (done) => {
    const store = configureStore({lastAction : 'NONE'}, (state, action) => {
      return {lastAction : action.type};
    });
    let count = 0;
    const unsubscribe = store.subscribe(() => {
      count++;
      if (count === 1) {
        expect(store.getState().lastAction).to.equal('DO_STUFF_REQUEST');
      } else if (count === 2) {
        expect(store.getState().lastAction).to.equal('DO_STUFF');
        unsubscribe();
        done();
      }
    });
    store.dispatch({
      type : 'DO_STUFF',
      promise : new Promise(function (resolve) {
        setTimeout(resolve, 1);
      })
    });
  });

  it('works on resolved promises', (done) => {
    const store = configureStore({lastAction : 'NONE'}, (state, action) => {
      return {lastAction : action.type, result : action.result};
    });
    let count = 0;
    const unsubscribe = store.subscribe(() => {
      count++;
      if (count === 1) {
        expect(store.getState().lastAction).to.equal('DO_STUFF_REQUEST');
        expect(store.getState().result).to.be.undefined;
      } else if (count === 2) {
        expect(store.getState().lastAction).to.equal('DO_STUFF');
        expect(store.getState().result).to.equal('done.');
        unsubscribe();
        done();
      }
    });
    const p = new Promise((resolve) => resolve('done.'));
    store.dispatch({
      type : 'DO_STUFF',
      promise : p
    });
  });

  it('works on promises that will be resolved', (done) => {
    const store = configureStore({a : 1}, (state) => state);
    let count = 0;
    store.subscribe(() => {
      count++;
      if (count === 2) {
        done();
      }
    });
    store.dispatch({
      type : 'DO_STUFF',
      promise : new Promise(function (resolve) {
        setTimeout(resolve, 1);
      })
    });
  });

  it('works on failed promises', (done) => {
    const store = configureStore({lastAction : 'NONE'}, (state, action) => {
      return {lastAction : action.type, result : action.result, error : action.error};
    });
    let count = 0;
    store.subscribe(() => {
      count++;
      if (count === 1) {
        expect(store.getState().lastAction).to.equal('FAIL_STUFF_REQUEST');
        expect(store.getState().result).to.be.undefined;
        expect(store.getState().error).to.be.undefined;
      } else if (count === 2) {
        expect(store.getState().lastAction).to.equal('FAIL_STUFF_FAILURE');
        expect(store.getState().result).to.be.undefined;
        expect(store.getState().error).to.equal('failed!');
        done();
      }
    });
    store.dispatch({
      type : 'FAIL_STUFF',
      promise : new Promise(function (resolve, reject) {
        reject('failed!');
      })
    });
  });

  it('works on promises that will fail', (done) => {
    const store = configureStore({lastAction : 'NONE'}, (state, action) => {
      return {lastAction : action.type, result : action.result, error : action.error};
    });
    let count = 0;
    store.subscribe(() => {
      count++;
      if (count === 1) {
        expect(store.getState().lastAction).to.equal('FAIL_STUFF_REQUEST');
        expect(store.getState().result).to.be.undefined;
        expect(store.getState().error).to.be.undefined;
      } else if (count === 2) {
        expect(store.getState().lastAction).to.equal('FAIL_STUFF_FAILURE');
        expect(store.getState().result).to.be.undefined;
        expect(store.getState().error).to.equal('failed!');
        done();
      }
    });
    store.dispatch({
      type : 'FAIL_STUFF',
      promise : new Promise(function (resolve, reject) {
        setTimeout(() => {
          reject('failed!');
        }, 1);
      })
    });
  });

});
