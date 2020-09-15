/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const initialState = {
  loading: false
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_LOADING:
      return updateObject(state, { loading: true });
    case actionTypes.HIDE_LOADING:
      return updateObject(state, { loading: false });
    case actionTypes.ACTION_TEST:
      return updateObject(state, { name: action.payload.name });
    case actionTypes.SET_INFECTION_TREE:
      return updateObject(state, { infection_tracking: action.payload });
    case actionTypes.SET_SIMULATION_TREE:
      return updateObject(state, { simulation_tree: action.payload });
    case actionTypes.EXIT_SIMULATION:
      return updateObject(state, { simulation_tree: undefined });
    case actionTypes.SET_OFFICE_STATISTICS:
      return updateObject(state, { office_statistics: action.payload });
    case actionTypes.SET_WRISTBAND_DATA:
      return updateObject(state, { wristband_data: action.payload });
    case actionTypes.SET_USER_LIST:
      return updateObject(state, { user_list: action.payload });
    case actionTypes.SET_PEOPLE_STATISTICS:
      return updateObject(state, { people_statistics: action.payload });
    case actionTypes.SET_ROOM_STATISTICS:
      return updateObject(state, { room_statistics: action.payload });
    default:
      return state;
  }
};

export default dataReducer;
