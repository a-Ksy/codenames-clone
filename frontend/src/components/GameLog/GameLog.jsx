/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import './GameLog.scss';

function GameLog(props) {
  const { logs } = props;
  return (
    <div className="GameLog">
      <p className="title">Game log</p>
      <div className="logs">
        {logs.length !== 0 && logs.map((log, index) => (
          <p key={index} className="log">
            <span className={`logNickname ${log.playerColor}`}>
              {log.nickName}
              {' '}
            </span>
            {log.text}
            {' '}
            <span className={`logWord ${log.cardColor !== '' && log.cardColor}`}>
              {log.clueWord}
              {' '}
              {log.clueNumber !== ''
          && <span>{log.clueNumber}</span>}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default GameLog;
