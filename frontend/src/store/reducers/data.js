/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const initialState = {
  loading: false,
  loggedIn: false,
  isInGame: false,
  rooms: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_LOADING:
      return updateObject(state, { loading: true });
    case actionTypes.HIDE_LOADING:
      return updateObject(state, { loading: false });
    case actionTypes.SET_USER_DATA:
      return updateObject(state, { loggedIn: true, user: action.payload });
    case actionTypes.SET_ROOMS_DATA:
      return updateObject(state, { rooms: action.payload });
    case actionTypes.SET_ROOM_DATA:
      return updateObject(state, { isInGame: true, room: action.payload });
    default:
      return state;
  }
};

export default dataReducer;
