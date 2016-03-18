import ActionTypes from '../actions/actionTypes';
import { fromJS } from 'immutable';

const initialState = fromJS({
  width : 500,
  height : 500,
  users : [
    {
      id : 1,
      name : "User-1",
      color : "#f00"
    },
    {
      id : 2,
      name : "User-2",
      color : "#0f0"
    },
    {
      id : 3,
      name : "User-3",
      color : "#00f"
    }
  ],
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

      console.log('Index: ', rowIndex, colIndex, color);

      return tiles.update(rowIndex, (row) => {
        return row.update(colIndex, (tile) => {
          return tile.update('color', () => color);
        })
      });
    });
  }
};

export default {
  initialState,
  reducerMap
};
