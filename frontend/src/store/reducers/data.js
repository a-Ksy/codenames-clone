/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const initialState = {
  loading: false,
  loggedIn: false,
  isInGame: false,
  rooms: [],
  status: '',
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
    case actionTypes.LEAVE_GAME:
      return updateObject(state, { isInGame: false, room: null, rooms: action.payload });
    case actionTypes.SET_KICKED_DATA:
      return updateObject(state, { isInGame: false, room: null, rooms: action.payload });
    case actionTypes.SET_TOKEN:
      return updateObject(state, { token: action.payload });
    case actionTypes.SET_STATUS:
      return updateObject(state, { status: action.payload });
    default:
      return state;
  }
};

export default dataReducer;
