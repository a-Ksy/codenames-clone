/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-extend-native */
import axios from 'axios';

const methods = {
  GET: 'get',
  POST: 'post',
};

const urls = {
  CREATE_USER_URL: 'http://localhost:8080/player/create',
  ROOMS_DATA_URL: 'http://localhost:8080/game/games',
  CREATE_ROOM_URL: 'http://localhost:8080/game/create',
  ROOM_DATA_URL: 'http://localhost:8080/game',
  CHECK_SESSION_URL: 'http://localhost:8080/player/check',
  CHECK_ROOM_SESSION_URL: 'http://localhost:8080/room/check',

};

const apiCall = (
  url,
  method = methods.GET,
  params = null,
  data = null,
  callback = () => {},
  onError = () => {},
  headers = {},
) => {
  axios({
    url,
    method,
    params,
    data,
    headers,
  })
    .then((response) => {
      callback(response);
    })
    .catch((err) => {
      console.log(err);
      onError(err);
    });
};

export const apiCreateUser = (nickname, callback, onError) => {
  const data = { nickName: nickname };
  apiCall(urls.CREATE_USER_URL, methods.POST, null, data, callback, onError);
};

export const apiGetRoomsData = (callback, onError) => {
  apiCall(urls.ROOMS_DATA_URL, methods.GET, null, null, callback, onError);
};

export const apiCreateRoom = (userId, roomName, callback, onError) => {
  const data = {
    gameDTO: {
      gameName: roomName,
    },
    playerId: userId,
  };
  apiCall(urls.CREATE_ROOM_URL, methods.POST, null, data, callback, onError);
};

export const apiGetRoomData = (userId, roomId, callback, onError) => {
  const params = new URLSearchParams();
  params.append('gameId', roomId);
  params.append('playerId', userId);
  apiCall(urls.ROOM_DATA_URL, methods.GET, params, null, callback, onError);
};

export const apiCheckSession = (userId, nickname, callback, onError) => {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('nickName', nickname);
  apiCall(urls.CHECK_SESSION_URL, methods.GET, params, null, callback, onError);
};

export const apiCheckRoomSession = (userId, roomId, callback, onError) => {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('roomId', roomId);
  apiCall(urls.CHECK_ROOM_SESSION_URL, methods.GET, params, null, callback, onError);
};
