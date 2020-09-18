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
  ROOMS_DATA_URL: 'https://jsonplaceholder.typicode.com/todos/1',
  CREATE_ROOM_URL: 'https://jsonplaceholder.typicode.com/todos/1',
  ROOM_DATA_URL: 'https://jsonplaceholder.typicode.com/todos/1',
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

export const apiGetRoomsData = (nickname, callback, onError) => {
  const params = new URLSearchParams();
  params.append('nickname', nickname);
  apiCall(urls.ROOMS_DATA_URL, methods.GET, params, null, callback, onError);
};

export const apiCreateRoom = (userId, roomName, callback, onError) => {
  const data = { userId: userId, roomName: roomName };
  apiCall(urls.CREATE_ROOM_URL, methods.POST, null, data, callback, onError);
};

export const apiGetRoomData = (userId ,roomId, callback, onError) => {
  const data = { roomId: roomId, userId: userId };
  apiCall(urls.ROOM_DATA_URL, methods.POST, null, data, callback, onError);
};