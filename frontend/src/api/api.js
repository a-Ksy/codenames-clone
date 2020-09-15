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
  GAME_DATA_URL: 'https://jsonplaceholder.typicode.com/todos/1',
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

export const apiGetGameData = (nickname, callback, onError) => {
  const params = new URLSearchParams();
  params.append('nickname', nickname);
  apiCall(urls.GAME_DATA_URL, methods.GET, params, null, callback, onError);
};
