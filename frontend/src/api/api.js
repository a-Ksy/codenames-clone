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
  CHECK_ROOM_SESSION_URL: 'http://localhost:8080/game/check',
  CHANGE_PLAYER_TYPE_URL: 'http://localhost:8080/game/changePlayerType',
  RESET_GAME_URL: 'http://localhost:8080/game/reset',
  GIVE_CLUE_URL: 'http://localhost:8080/game/giveClue',
  LEAVE_GAME_URL: 'http://localhost:8080/game/leave',
  HIGHLIGHT_CARD_URL: 'http://localhost:8080/game/highlightCard',
  KICK_PLAYER_URL: 'http://localhost:8080/game/kick',
  SELECT_CARD_URL: 'http://localhost:8080/game/selectCard',
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
  params.append('gameId', roomId);
  apiCall(urls.CHECK_ROOM_SESSION_URL, methods.GET, params, null, callback, onError);
};

export const apiChangePlayerType = (roomId, playerId, playerType, team, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
    },
    playerId,
    playerType,
    team,
  };
  apiCall(urls.CHANGE_PLAYER_TYPE_URL, methods.POST, null, data, callback, onError);
};

export const apiResetGame = (roomId, playerId, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
    },
    playerId,
  };
  apiCall(urls.RESET_GAME_URL, methods.POST, null, data, callback, onError);
};

export const apiGiveClue = (roomId, clueWord, clueNumber, playerId, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
      clueWord,
      clueNumber,
    },
    playerId,
  };
  apiCall(urls.GIVE_CLUE_URL, methods.POST, null, data, callback, onError);
};

export const apiLeaveGame = (roomId, playerId, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
    },
    playerId,
  };
  apiCall(urls.LEAVE_GAME_URL, methods.POST, null, data, callback, onError);
};

export const apiHighlightCard = (roomId, playerId, cardId, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
    },
    playerId,
    cardId,
  };
  apiCall(urls.HIGHLIGHT_CARD_URL, methods.POST, null, data, callback, onError);
};

export const apiSelectCard = (roomId, playerId, cardId, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
    },
    playerId,
    cardId,
  };
  apiCall(urls.SELECT_CARD_URL, methods.POST, null, data, callback, onError);
};

export const apiKickPlayer = (roomId, playerId, callback, onError) => {
  const data = {
    gameDTO: {
      id: roomId,
    },
    playerId,
  };
  apiCall(urls.KICK_PLAYER_URL, methods.POST, null, data, callback, onError);
};
