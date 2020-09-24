import React from 'react';
import PropTypes from 'prop-types';
import variables from '../../sass/_variables.scss';
import './GameLog.scss';

const propTypes = {
  logs: PropTypes.objectOf.isRequired,
};

const defaultProps = {
};

function GameLog(props) {
  const { logs } = props;
  return (
    <div className="GameLog">
      <p className="title">Game log</p>
      <div className="logs">
        {logs.length !== 0 && logs.map((log) => (
          <p className="log">
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

GameLog.propTypes = propTypes;
GameLog.defaultProps = defaultProps;

export default GameLog;
