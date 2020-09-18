import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import variables from '../../sass/_variables.scss';
import './TeamCard.scss';

const propTypes = {
  type: PropTypes.string.isRequired,
  cardsLeft: PropTypes.string.isRequired,
  operativeList: PropTypes.objectOf,
  spymasterList: PropTypes.objectOf
};

const defaultProps = {
  operativeList: [],
  spymasterList: []
};

function TeamCard(props) {
  const { cardsLeft, type, operativeList, spymasterList } = props;
  return (
    <div className={`TeamCard ${type}`}>
      <div className="titleBox">
        <h1 className="cardsLeft">{cardsLeft}</h1>
        <h4 className="playerTitle">Operatives</h4>
        {operativeList.map(operative => (
          <p className="playerNickname">{operative}</p>
        ))}
        <Button title="Join as operative" type="TeamCard" color={type == "red" ? `${variables.redTeamDark}` : `${variables.blueTeamDark}`}/>
      </div>
      <div className="titleBox">
        <h4 className="playerTitle">Spymasters</h4>
        {spymasterList.map(spymaster => (
          <p className="playerNickname">{spymaster}</p>
        ))}
        <Button title="Join as spymaster" type="TeamCard" color={type == "red" ? `${variables.redTeamDark}` : `${variables.blueTeamDark}`} />
      </div>
    </div>
  );
}

TeamCard.propTypes = propTypes;
TeamCard.defaultProps = defaultProps;

export default TeamCard;
