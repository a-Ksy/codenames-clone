/* eslint-disable no-undef */
import * as actionTypes from './actionTypes';

import {
  apiGetGameData,
} from '../../api/api';

export const showLoading = () => ({
  type: actionTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
  type: actionTypes.HIDE_LOADING,
});

export const setGameData = (payload) => ({
  type: actionTypes.SET_GAME_DATA,
  payload,
});

export const getGameData = (nickname) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetGameData(
    nickname,
    (response) => {
      dispatch(setGameData(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    (err) => {
      console.log(`Error when retrieving infection tree:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};
