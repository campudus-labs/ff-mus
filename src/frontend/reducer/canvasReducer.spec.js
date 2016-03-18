import canvasReducerMapAndState from './canvasReducer';
import { combineReducerMapToReducer } from './index';
import { expect } from 'chai';

describe('canvas reducer', () => {

  const canvasReducer = combineReducerMapToReducer(canvasReducerMapAndState);

  it('starts with empty tiles', () => {
    const state = canvasReducer();
    state.get('tiles').every(row => {
      console.log('every row', row);
      return row.every(tile => tile.get('color') === null);
    })
  });

  it('starts with empty users', () => {
    const state = canvasReducer();
    expect(state.get('users').isEmpty()).to.equal(true);
  });

  it('can add new user', () => {
    const state = canvasReducer(canvasReducerMapAndState.initialState, {
      type : 'USER_JOIN',
      payload : {
        id : 1,
        name : 'Tester',
        color : '#00ff00'
      }
    });
    expect(state.get('users').isEmpty()).to.equal(false);
    expect(state.get('users').get(0).get('id')).to.equal(1);
    expect(state.get('users').get(0).get('name')).to.equal('Tester');
    expect(state.get('users').get(0).get('color')).to.equal('#00ff00');
  });

  it('can add multiple new users', () => {
    const actions = [{
      type : 'USER_JOIN',
      payload : {
        id : 1,
        name : 'Tester',
        color : '#00ff00'
      }
    }, {
      type : 'USER_JOIN',
      payload : {
        id : 2,
        name : 'Tester2',
        color : '#ff0000'
      }
    }];

    const state = actions.reduce(
      (latestState, nextAction) => canvasReducer(latestState, nextAction),
      canvasReducerMapAndState.initialState
    );

    expect(state.get('users').isEmpty()).to.equal(false);
    expect(state.get('users').count()).to.equal(2);
    expect(state.get('users').get(0).get('id')).to.equal(1);
    expect(state.get('users').get(0).get('name')).to.equal('Tester');
    expect(state.get('users').get(0).get('color')).to.equal('#00ff00');
    expect(state.get('users').get(1).get('id')).to.equal(2);
    expect(state.get('users').get(1).get('name')).to.equal('Tester2');
    expect(state.get('users').get(1).get('color')).to.equal('#ff0000');
  });

  it('can remove users', () => {
    const actions = [{
      type : 'USER_JOIN',
      payload : {
        id : 1,
        name : 'Tester',
        color : '#00ff00'
      }
    }, {
      type : 'USER_JOIN',
      payload : {
        id : 2,
        name : 'Tester2',
        color : '#ff0000'
      }
    }, {
      type : 'USER_LEFT',
      payload : {
        id : 1
      }
    }];

    const state = actions.reduce(
      (latestState, nextAction) => canvasReducer(latestState, nextAction),
      canvasReducerMapAndState.initialState
    );

    expect(state.get('users').count()).to.equal(1);
    expect(state.get('users').get(0).get('id')).to.equal(2);
    expect(state.get('users').get(0).get('name')).to.equal('Tester2');
    expect(state.get('users').get(0).get('color')).to.equal('#ff0000');
  });

});
