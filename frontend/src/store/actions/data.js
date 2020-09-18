/* eslint-disable no-undef */
import * as actionTypes from './actionTypes';

import {
  apiCreateRoom,
  apiGetRoomData,
  apiGetRoomsData,
} from '../../api/api';

export const showLoading = () => ({
  type: actionTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
  type: actionTypes.HIDE_LOADING,
});

export const setRoomsData = (payload) => ({
  type: actionTypes.SET_ROOMS_DATA,
  payload,
});

export const getRoomsData = (nickname) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetRoomsData(
    nickname,
    (response) => {
      dispatch(setRoomsData(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    (err) => {
      console.log(`Error when retrieving rooms data:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};

export const setRoomData = (payload) => ({
  type: actionTypes.SET_ROOM_DATA,
  payload,
});


export const createRoom = (userId, roomName) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiCreateRoom(
    userId,
    roomName,
    (response) => {
      dispatch(setRoomData(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    (err) => {
      console.log(`Error when creating room:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};

export const getRoomData = (userId, roomId) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetRoomData(
    userId,
    roomId,
    (response) => {
      dispatch(setRoomData(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    (err) => {
      console.log(`Error when getting room:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};
