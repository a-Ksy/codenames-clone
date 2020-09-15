/* eslint-disable no-undef */
import * as actionTypes from './actionTypes';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

import {
  apiGetInfectionTree,
  apiGetSimulationTree,
  apiGetOfficeStatistics,
  apiGetWristbandData,
  apiGetUserList,
  apiGetPeopleStatistics,
  apiGetRoomStatistics
} from '../../api/api';

export const showLoading = () => ({
  type: actionTypes.SHOW_LOADING
});

export const hideLoading = () => ({
  type: actionTypes.HIDE_LOADING
});

export const setName = name => ({
  type: actionTypes.ACTION_TEST,
  payload: {
    name
  }
});

export const setInfectionTree = payload => ({
  type: actionTypes.SET_INFECTION_TREE,
  payload
});

export const getInfectionTree = (startDate, timeline, idToken) => dispatch => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetInfectionTree(
    startDate,
    timeline,
    idToken,
    response => {
      dispatch(setInfectionTree(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    err => {
      console.log(`Error when retrieving infection tree:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    }
  );
};

export const setSimulationTree = payload => ({
  type: actionTypes.SET_SIMULATION_TREE,
  payload
});

export const getSimulationTree = (startDate, userID, idToken) => dispatch => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetSimulationTree(
    startDate,
    userID,
    idToken,
    response => {
      dispatch(setSimulationTree(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    err => {
      console.log(`Error when retrieving simulation tree:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    }
  );
};

export const setOfficeStatistics = payload => ({
  type: actionTypes.SET_OFFICE_STATISTICS,
  payload
});

export const setWristbandData = payload => ({
  type: actionTypes.SET_WRISTBAND_DATA,
  payload
});

export const setUserList = payload => ({
  type: actionTypes.SET_USER_LIST,
  payload
});

export const setPeopleStatistics = payload => ({
  type: actionTypes.SET_PEOPLE_STATISTICS,
  payload
});

export const getPeopleStatistics = (startDate, endDate, userList, idToken) => dispatch => {
  apiGetPeopleStatistics(
    startDate,
    endDate,
    userList,
    idToken,
    response => {
      dispatch(setPeopleStatistics(response.data.payload));
    },
    err => {
      console.log(`Error when retrieving people statistics:\n${err}`);
    }
  );
};

export const setRoomStatistics = payload => ({
  type: actionTypes.SET_ROOM_STATISTICS,
  payload
});

export const getRoomStatistics = (startDate, endDate, idToken) => dispatch => {
  console.log('gelen startdate', startDate);
  console.log('gelen enddate', endDate);
  apiGetRoomStatistics(
    startDate,
    endDate,
    idToken,
    response => {
      dispatch(setRoomStatistics(response.data.payload));
    },
    err => {
      console.log(`Error when retrieving room statistics:\n${err}`);
    }
  );
};

export const getDashboardData = idToken => dispatch => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetWristbandData(
    idToken,
    response => {
      dispatch(setWristbandData(response.data));
      apiGetOfficeStatistics(
        idToken,
        responseStatistics => {
          dispatch(setOfficeStatistics(responseStatistics.data.payload));
          apiGetUserList(
            idToken,
            responseUserList => {
              dispatch(setUserList(responseUserList.data));
              apiGetPeopleStatistics(
                moment()
                  .tz('Europe/Istanbul')
                  .subtract(30, 'days')
                  .format('YYYY-MM-DD'),
                moment()
                  .tz('Europe/Istanbul')
                  .format('YYYY-MM-DD'),
                [],
                idToken,
                responsePeopleStatistics => {
                  dispatch(setPeopleStatistics(responsePeopleStatistics.data.payload));
                  apiGetRoomStatistics(
                    moment()
                      .tz('Europe/Istanbul')
                      .subtract(7, 'days')
                      .format('YYYY-MM-DD'),
                    moment()
                      .tz('Europe/Istanbul')
                      .format('YYYY-MM-DD'),
                    idToken,
                    responseRoomStatistics => {
                      dispatch(setRoomStatistics(responseRoomStatistics.data.payload));
                      dispatch({ type: actionTypes.HIDE_LOADING });
                    },
                    err => {
                      console.log(`Error when retrieving room statistics:\n${err}`);
                      dispatch({ type: actionTypes.HIDE_LOADING });
                    }
                  );
                },
                err => {
                  console.log(`Error when retrieving people statistics:\n${err}`);
                  dispatch({ type: actionTypes.HIDE_LOADING });
                }
              );
            },
            err => {
              console.log(`Error when retrieving user list:\n${err}`);
              dispatch({ type: actionTypes.HIDE_LOADING });
            }
          );
        },
        err => {
          console.log(`Error when retrieving office statistics:\n${err}`);
          dispatch({ type: actionTypes.HIDE_LOADING });
        }
      );
    },
    err => {
      console.log(`Error when retrieving wristband data:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    }
  );
};

export const exitSimulation = () => ({
  type: actionTypes.EXIT_SIMULATION
});
