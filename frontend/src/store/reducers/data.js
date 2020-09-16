/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const initialState = {
  loading: false,
  loggedIn: false,
  rooms: [],
  room: {roomId: 0},
  userId: undefined,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_LOADING:
      return updateObject(state, { loading: true });
    case actionTypes.HIDE_LOADING:
      return updateObject(state, { loading: false });
    case actionTypes.SET_ROOMS_DATA:
      return updateObject(state, { userId: 0, loggedIn: true, rooms: action.payload});
    case actionTypes.SET_ROOM_DATA:
      return updateObject(state, { room: action.payload });
    default:
      return state;
  }
};

export default dataReducer;
