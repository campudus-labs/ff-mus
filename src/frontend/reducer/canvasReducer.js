import ActionTypes from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
  width : 500,
  height : 500,
  serverStatus : {
    isRequesting : false,
    isConnecting : false
  },
  users : {
    myUserId : 1,
    order : [/*
     1,
     2,
     3
     */],
    entities : {
      1 : {
        id : 1,
        name : "User-1",
        color : "#f00"
      }/*,
       2 : {
       id : 2,
       name : "User-2",
       color : "#0f0"
       },
       3 : {
       id : 3,
       name : "User-3",
       color : "#00f"
       }*/
    }
  },
  tilesDimensions : [0, 0],
  tiles : [
    [
      {
        number : 1,
        color : null
      },
      {
        number : 2,
        color : null
      },
      {
        number : 3,
        color : null
      }
    ],
    [
      {
        number : 4,
        color : null
      },
      {
        number : 5,
        color : null
      },
      {
        number : 6,
        color : null
      }
    ],
    [
      {
        number : 7,
        color : null
      },
      {
        number : 8,
        color : null
      },
      {
        number : 9,
        color : null
      }
    ]
  ]
};

const reducerMap = {
  [ActionTypes.SET_CANVAS_LAYOUT] : (state, payload) => {
    return _.merge(state, payload);
  },
  [ActionTypes.USER_CLICK] : (state, payload) => {
    const {number, color} = payload;
    console.log("tiles", state.tiles);
    const tiles = _.reduce(state.tiles, (result, tileRow, tileRowIndex)=> {
      const tileRowArray = _.map(tileRow, (tileObj, tileObjIndex)=> {
        if (tileObj.number === number) {
          return {
            number : tileObj.number,
            color : color
          }
        } else {
          return {
            number : tileObj.number,
            color : null
          }
        }
      });

      result.push(tileRowArray);

      return result;
    }, []);

    return _.merge({}, state, {tiles : tiles});

  },

  [ActionTypes.LOGIN_REQUEST] : (state) => {
    return _.merge({}, state, {serverStatus : {isConnecting : true}});
  },

  [ActionTypes.LOGIN_SUCCESS] : (state, payload) => {
    console.log("Login success:", payload, "payload.id:", payload.id);
    return _.merge({}, state, {serverStatus : {isConnecting : false}});
  },

  [ActionTypes.LOGIN_FAILED] : (state, error) => {
    console.error("Login failed:", error);
    return _.merge({}, state, {serverStatus : {isConnecting : false}});
  },

  [ActionTypes.USER_JOIN] : (state, payload) => {
    console.log("Login USER_JOIN:", payload);
    //Push user to entities
    return _.merge({}, state, {
      users : {
        entities : {
          [payload.id] : {
            id : payload.id,
            name : payload.name,
            color : payload.color
          }
        }
      }
    });
  },

  [ActionTypes.SET_MY_USER_ID] : (state, payload) => {
    console.error("Login SET_MY_USER_ID:", payload);
    return _.merge({}, state, {users : {myUserId : payload.id}});
  }

};

export default {
  initialState,
  reducerMap
};
