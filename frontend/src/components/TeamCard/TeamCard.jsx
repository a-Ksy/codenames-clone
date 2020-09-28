/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import variables from '../../sass/_variables.scss';
import './TeamCard.scss';
import { changePlayerType, setUserData } from '../../store/actions';

const propTypes = {
  type: PropTypes.string.isRequired,
  cardsLeft: PropTypes.number.isRequired,
  operativeList: PropTypes.array,
  spymasterList: PropTypes.array,
};

const defaultProps = {
  operativeList: [],
  spymasterList: [],
};

function TeamCard(props) {
  const {
    cardsLeft, type, operativeList, spymasterList, room, user,
  } = props;

  const handleChangePlayerType = (roomId, playerId, playerType, team) => {
    const {
      retrieveChangePlayerType, retrieveSetUserData, user, token,
    } = props;
    retrieveChangePlayerType(roomId, playerId, playerType, team, token);
    const tempUser = user;
    tempUser.playerType = playerType;
    tempUser.team = team;
    retrieveSetUserData(tempUser);
  };

  return (
    <div className={`TeamCard ${type}`}>
      <div className="titleBox">
        <h1 className="cardsLeft">{cardsLeft}</h1>
        <h4 className="playerTitle">Operatives</h4>
        {operativeList.map((operative) => (
          <p key={operative.id} className="playerNickname">{operative.nickName}</p>
        ))}
        {((user.playerType !== 'SPYMASTER' && user.team !== type))
          && (
          <Button
            title="Join as operative"
            type="TeamCard"
            color={type === 'RED' ? `${variables.redTeamDark}` : `${variables.blueTeamDark}`}
            onClick={() => handleChangePlayerType(room.id, user.id, 'OPERATIVE', type)}
          />
          )}
      </div>
      <div className="titleBox">
        <h4 className="playerTitle">Spymasters</h4>
        {spymasterList.map((spymaster) => (
          <p key={spymaster.id} className="playerNickname">{spymaster.nickName}</p>
        ))}
        {spymasterList.length === 0
          && (
          <Button
            title="Join as spymaster"
            type="TeamCard"
            color={type === 'RED' ? `${variables.redTeamDark}` : `${variables.blueTeamDark}`}
            onClick={() => handleChangePlayerType(room.id, user.id, 'SPYMASTER', type)}
          />
          )}
      </div>
    </div>
  );
}

TeamCard.propTypes = propTypes;
TeamCard.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  room: state.data.room,
  user: state.data.user,
  token: state.data.token,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveChangePlayerType: (roomId, playerId, playerType, team, token) => dispatch(changePlayerType(roomId, playerId, playerType, team, token)),
  retrieveSetUserData: (payload) => dispatch(setUserData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TeamCard));
