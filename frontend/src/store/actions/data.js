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
  apiResetGame,
  apiGiveClue,
  apiLeaveGame,
  apiHighlightCard,
  apiKickPlayer,
  apiSelectCard,
  apiEndGuess,
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

export const setToken = (payload) => ({
  type: actionTypes.SET_TOKEN,
  payload,
});

export const setRoomsData = (payload) => ({
  type: actionTypes.SET_ROOMS_DATA,
  payload,
});

export const setKickedData = (payload) => ({
  type: actionTypes.SET_KICKED_DATA,
  payload,
});

export const setStatus = (payload) => ({
  type: actionTypes.SET_STATUS,
  payload,
});

export const createUser = (nickname) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiCreateUser(
    nickname,
    (response1) => {
      dispatch(setToken(response1.headers.token));
      dispatch(setUserData(response1.data));
      apiGetRoomsData(
        response1.headers.token,
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

export const checkSession = (userId, nickName, token) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiCheckSession(
    userId,
    nickName,
    token,
    (response) => {
      dispatch(setUserData(response.data));
      apiGetRoomsData(
        token,
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

export const setLeaveData = (payload) => ({
  type: actionTypes.LEAVE_GAME,
  payload,
});

export const checkRoomSession = (userId, roomId, token) => (dispatch) => {
  apiCheckRoomSession(
    userId,
    roomId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
    },
  );
};

export const getRoomsData = (token) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetRoomsData(
    token,
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

export const getKickedData = (token) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiGetRoomsData(
    token,
    (response) => {
      dispatch(setKickedData(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    (err) => {
      console.log(`Error when getting kicked data:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};

export const getRoomData = (userId, roomId, password, token) => (dispatch) => {
  apiGetRoomData(
    userId,
    roomId,
    password,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      dispatch(setStatus(err.response.data));
    },
  );
};

export const createRoom = (userId, roomName, roomPassword, token) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiCreateRoom(
    userId,
    roomName,
    roomPassword,
    token,
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

export const changePlayerType = (roomId, playerId, playerType, team, token) => (dispatch) => {
  apiChangePlayerType(
    roomId,
    playerId,
    playerType,
    team,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when changing player type:\n${err}`);
    },
  );
};

export const resetGame = (roomId, playerId, token) => (dispatch) => {
  apiResetGame(
    roomId,
    playerId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when resetting game:\n${err}`);
    },
  );
};

export const giveClue = (roomId, clueWord, clueNumber, playerId, token) => (dispatch) => {
  apiGiveClue(
    roomId,
    clueWord,
    clueNumber,
    playerId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when giving clue:\n${err}`);
    },
  );
};

export const leaveGame = (roomId, playerId, token) => (dispatch) => {
  dispatch({ type: actionTypes.SHOW_LOADING });
  apiLeaveGame(
    roomId,
    playerId,
    token,
    (response) => {
      dispatch(setLeaveData(response.data));
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
    (err) => {
      console.log(`Error when retrieving rooms data:\n${err}`);
      dispatch({ type: actionTypes.HIDE_LOADING });
    },
  );
};

export const highlightCard = (roomId, playerId, cardId, token) => (dispatch) => {
  apiHighlightCard(
    roomId,
    playerId,
    cardId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when highlighting card:\n${err}`);
    },
  );
};

export const selectCard = (roomId, playerId, cardId, token) => (dispatch) => {
  apiSelectCard(
    roomId,
    playerId,
    cardId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when selecting card:\n${err}`);
    },
  );
};

export const kickPlayer = (roomId, playerId, token) => (dispatch) => {
  apiKickPlayer(
    roomId,
    playerId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when kicking player:\n${err}`);
    },
  );
};

export const endGuess = (roomId, playerId, token) => (dispatch) => {
  apiEndGuess(
    roomId,
    playerId,
    token,
    (response) => {
      dispatch(setRoomData(response.data));
    },
    (err) => {
      console.log(`Error when ending guess:\n${err}`);
    },
  );
};
