/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const initialState = {
  loading: false,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_LOADING:
      return updateObject(state, { loading: true });
    case actionTypes.HIDE_LOADING:
      return updateObject(state, { loading: false });
    case actionTypes.SET_GAME_DATA:
      return updateObject(state, { gameData: action.payload });
    default:
      return state;
  }
};

export default dataReducer;
