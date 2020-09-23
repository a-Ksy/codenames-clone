/* eslint-disable no-undef */
import * as actionTypes from './actionTypes';

import {
  apiCreateUser,
  apiCreateRoom,
  apiGetRoomData,
  apiGetRoomsData,
  apiCheckSession,
  apiCheckRoomSession,
  apiChangePlayerType,
} from '../../api/api';

export const showLoading = () => ({
  type: actionTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
  type: actionTypes.HIDE_LOADING,
});

export const setUserData = (payload) => ({
  type: actionTypes.SET_USER_DATA,
  payload,
});

export const setRoomsData = (payload) => ({
  type: actionTypes.SET_ROOMS_DATA,
  payload,
});

export const createUser = (nickname) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiCreateUser(
    nickname,
    (response1) => {
      dispatch(setUserData(response1.data));
      apiGetRoomsData(
        (response2) => {
          dispatch(setRoomsData(response2.data));
          dispatch({ type: actionTypes.HIDE_LOADING });
        },
        (err) => {
          console.log(`Error when creating user:\n${err}`);
          dispatch({ type: actionTypes.HIDE_LOADING });
        },
      );
    },
    (err) => {
      console.log(`Error when retrieving rooms data:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};

export const checkSession = (userId, nickName) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiCheckSession(
    userId,
    nickName,
    (response) => {
      dispatch(setUserData(response.data));
      apiGetRoomsData(
        (response2) => {
          dispatch(setRoomsData(response2.data));
          dispatch({ type: actionTypes.HIDE_LOADING });
        },
        (err) => {
          console.log(`Error when retrieving rooms data:\n${err}`);
          dispatch({ type: actionTypes.HIDE_LOADING });
        },
      );
    },
    (err) => {
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};

export const setRoomData = (payload) => ({
  type: actionTypes.SET_ROOM_DATA,
  payload,
});

export const checkRoomSession = (userId, roomId) => (dispatch) => {
  apiCheckRoomSession(
    userId,
    roomId,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
    },
  );
};

export const getRoomsData = () => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetRoomsData(
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

export const getRoomData = (userId, roomId) => (dispatch) => {
  apiGetRoomData(
    userId,
    roomId,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when getting room:\n${err}`);
    },
  );
};

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

export const changePlayerType = (roomId, playerId, playerType, team) => (dispatch) => {
  apiChangePlayerType(
    roomId,
    playerId,
    playerType,
    team,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when changing player type:\n${err}`);
    },
  );
};
