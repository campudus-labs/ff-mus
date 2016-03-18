import ActionTypes from '../actions/actionTypes';
import { fromJS } from 'immutable';

const initialState = fromJS({
  width : 500,
  height : 500,
  serverStatus : {
    isRequesting : false,
    isConnecting : false,
  },
  users : {
    myUserId : 2,
    order : [/*
     1,
     2,
     3
     */],
    entities : {
      /*1 : {
       id : 1,
       name : "User-1",
       color : "#f00"
       },
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
});

const reducerMap = {
  [ActionTypes.SET_CANVAS_LAYOUT] : (state, payload) => {
    return state.merge(payload);
  },
  [ActionTypes.USER_CLICK] : (state, payload) => {
    const {number, color} = payload;

    return state.update('tiles', (tiles) => {
      let colIndex = null;
      const rowIndex = tiles.findIndex((row) => {
        let found = false;

        colIndex = row.findIndex((tile) => {
          if (tile.get('number') === number) {
            found = true;
            return true;
          }
        });

        return found;
      });

      return tiles.update(rowIndex, (row) => {
        return row.update(colIndex, (tile) => {
          return tile.update('color', (currentColor) => {
            if (currentColor) {
              return null;
            } else {
              return color;
            }
          });
        })
      });
    });
  },

  [ActionTypes.LOGIN_REQUEST] : (state) => {
    return state.updateIn(["serverStatus", "isConnecting"], () => true);
  },

  [ActionTypes.LOGIN_SUCCESS] : (state, payload) => {
    console.log("Login success:", payload, "payload.id:", payload.id);
    return state.updateIn(["serverStatus", "isConnecting"], () => false);
  },

  [ActionTypes.LOGIN_FAILED] : (state, error) => {
    console.error("Login failed:", error);
    return state.updateIn(["serverStatus", "isConnecting"], () => false);
  },

  [ActionTypes.USER_JOIN] : (state, payload) => {
    console.log("Login USER_JOIN:", payload);
    //Push user to entities
    return state.setIn(["users", "entities", payload.id], () => {
      return fromJS({
        id : payload.id,
        name : payload.name,
        color : payload.color
      });
    });
  },

  [ActionTypes.SET_MY_USER_ID] : (state, payload) => {
    console.error("Login SET_MY_USER_ID:", payload);
    return state.updateIn(["users", "myUserId"], () => payload.id);
  }

};

export default {
  initialState,
  reducerMap
};
