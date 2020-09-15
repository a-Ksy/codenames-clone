/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable indent */

import * as actionTypes from './actionTypes';

export const fetchStatsPending = () => ({
    type: actionTypes.FETCH_STATS_PENDING,
});

export const fetchStatsSuccess = stats => ({
    type: actionTypes.FETCH_STATS_SUCCESS,
    payload: {
        stats,
    },
});

export const fetchStatsError = error => ({
    type: actionTypes.FETCH_STATS_ERROR,
    payload: {
        error,
    },
});
