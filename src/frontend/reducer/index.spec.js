import { expect } from 'chai';
import { Map } from 'immutable';
import { combineReducerMapsToReducer, combineReducerMapsToReducerMap } from './index';

describe('combineReducerMapsToReducer', () => {

  it('complains if no object is given', () => {
    expect(() => {
      combineReducerMapsToReducer();
    }).to.throw(/no reducers given/);
  });

  it('complains if no reducers are given', () => {
    expect(() => {
      combineReducerMapsToReducer({});
    }).to.throw(/no reducers given/);
  });

  it('complains about missing reducerMap', () => {
    expect(() => {
      combineReducerMapsToReducer({
        something : {initialState : {}}
      });
    }).to.throw(/no reducerMap/);
  });

  it('complains about missing initialState', () => {
    expect(() => {
      combineReducerMapsToReducer({
        something : {reducerMap : {}}
      });
    }).to.throw(/not set initialState/);
  });

  it('will map plain objects into Immutable.Maps', () => {
    const combined = combineReducerMapsToReducer({
      something : {
        reducerMap : {},
        initialState : {}
      }
    });

    expect(combined() instanceof Map).to.be.true;
  });

  it('is possible to use an Immutable.Map as initial state', () => {
    const combined = combineReducerMapsToReducer({
      something : {
        reducerMap : {},
        initialState : Map({})
      }
    });

    expect(combined() instanceof Map).to.be.true;
  });

  describe('simple incremental reducer', () => {
    const reducer = {
      reducerMap : {
        increment : (state, action) => state.update('count', oldCount => oldCount + action.inc)
      },
      initialState : {
        count : 0
      }
    };

    it('returns the initial state of the reducer', () => {
      const combined = combineReducerMapsToReducer({
        reducer
      });

      expect(combined().toJS()).to.deep.equal({
        reducer : {
          count : 0
        }
      });
    });

    it('will increment the reducer when called', () => {
      const combined = combineReducerMapsToReducer({
        reducer
      });
      const state = combined();
      expect(combined(state, {type : 'increment', inc : 5}).toJS()).to.deep.equal({
        reducer : {
          count : 5
        }
      });
    });

    it('can be combined multiple times in different namespaces', () => {
      const combined = combineReducerMapsToReducer({
        reducer1 : reducer,
        reducer2 : reducer
      });
      const state = combined();
      expect(combined(state, {type : 'increment', inc : 5}).toJS()).to.deep.equal({
        reducer1 : {
          count : 5
        },
        reducer2 : {
          count : 5
        }
      });
    });

  });

  describe('multiple reducers', () => {
    const incReducer = {
      initialState : {count : 0},
      reducerMap : {
        increment : (state, action) => state.update('count', v => v + action.amount)
      }
    };
    const decReducer = {
      initialState : {count : 0},
      reducerMap : {
        decrement : (state, action) => state.update('count', v => v - action.amount)
      }
    };

    it('can be combined', () => {
      const combined = combineReducerMapsToReducer({
        incReducer,
        decReducer
      });

      expect(combined().toJS()).to.deep.equal({
        incReducer : {count : 0},
        decReducer : {count : 0}
      });
    });

    it('can be called separately', () => {
      const combined = combineReducerMapsToReducer({
        incReducer,
        decReducer
      });

      let state = combined();
      expect(combined(state, {type : 'increment', amount : 5}).toJS()).to.deep.equal({
        incReducer : {count : 5},
        decReducer : {count : 0}
      });

      state = combined();
      expect(combined(state, {type : 'decrement', amount : 5}).toJS()).to.deep.equal({
        incReducer : {count : 0},
        decReducer : {count : -5}
      });

      state = combined(state, {type : 'increment', amount : 5});
      expect(combined(state, {type : 'decrement', amount : 5}).toJS()).to.deep.equal({
        incReducer : {count : 5},
        decReducer : {count : -5}
      });
    });

    it('can be stacked through maps', () => {
      const combinedReducerMap = combineReducerMapsToReducerMap({
        incReducer,
        decReducer
      });
      const combined = combineReducerMapsToReducer({
        anotherInc : incReducer,
        combined : combinedReducerMap
      });

      const state = combined();
      expect(combined(state, {type : 'increment', amount : 1}).toJS()).to.deep.equal({
        anotherInc : {count : 1},
        combined : {
          incReducer : {count : 1},
          decReducer : {count : 0}
        }
      });
    });

  });

});
