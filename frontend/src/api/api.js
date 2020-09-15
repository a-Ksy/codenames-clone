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
  INFECTIONTREE_URL: 'https://hgals5hlyj.execute-api.eu-central-1.amazonaws.com/prod/getstructures',
  SIMULATION_URL: 'https://hgals5hlyj.execute-api.eu-central-1.amazonaws.com/prod/simulationcreate',
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

export const apiGetInfectionTree = (startDate, timeline, idToken, callback, onError) => {
  const params = new URLSearchParams();
  params.append('start_date', startDate);
  params.append('timeline', timeline);
  apiCall(urls.INFECTIONTREE_URL, methods.GET, params, null, callback, onError, {
    Authorization: `Bearer ${idToken}`,
  });
};

export const apiGetSimulationTree = (startDate, userID, idToken, callback, onError) => {
  const data = {
    SimulationId: userID,
    date: startDate,
    userid: userID,
  };
  apiCall(urls.SIMULATION_URL, methods.POST, null, data, callback, onError, {
    Authorization: `Bearer ${idToken}`,
  });
};
