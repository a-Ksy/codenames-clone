/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes, { string } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './GameCard.scss';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { highlightCard, selectCard } from '../../store/actions/data';

const propTypes = {
  type: PropTypes.string,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  highlighters: PropTypes.objectOf(string),
};

const defaultProps = {
  type: '',
  highlighters: {},
};

function GameCard(props) {
  const {
    type, title, highlighters, user, room, id, cardStatus, key,
  } = props;
  const { playerType, team } = user;
  const { gameStatus } = room;

  const handleHighlightCard = () => {
    const {
      retrieveHighlightCard, token,
    } = props;
    retrieveHighlightCard(room.id, user.id, id, token);
  };

  const handleSelectCard = (event) => {
    const {
      retrieveSelectCard, token,
    } = props;
    event.stopPropagation();
    retrieveSelectCard(room.id, user.id, id, token);
  };

  let button = null;
  let isHighlightable = false;
  if ((cardStatus !== 'OPEN') && (playerType === 'OPERATIVE') && ((gameStatus === 'RED_TEAM_OPERATIVE_ROUND' && team === 'RED') || (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND' && team === 'BLUE'))) {
    button = (
      <i
        className="fa fa-hand-pointer"
        onClick={(event) => handleSelectCard(event)}
      />
    );
    isHighlightable = true;
  }

  let gameCard = (
    <div
      className={`GameCardPlot ${type} ${Object.keys(highlighters).length !== 0 && 'Highlighted'} ${isHighlightable && 'isHighlightable'} `}
      onClick={isHighlightable ? (() => handleHighlightCard()) : () => {}}
    >
      {button}
      <h1 className="title">{title}</h1>
      <div className="highlighterNicknameBox">
        {Object.keys(highlighters).length !== 0
          && Object.keys(highlighters).map((key) => (
            <p className="highlighterNickname" key={key}>
              {highlighters[key]}
            </p>
          ))}
      </div>
    </div>
  );

  if (cardStatus === 'OPEN') {
    gameCard = (
      <div className={`GameCardPlot OPEN ${type}`}>
        <Flippy
          flipOnClick
          flipDirection="vertical"
          style={{ height: '100%', width: '100%' }}
        >
          <FrontSide />
          <BackSide>
            <h1 className="title">{title}</h1>
          </BackSide>
        </Flippy>
      </div>
    );
  }

  return (
    <div key={key} className="GameCard">
      { gameCard }
    </div>
  );
}

GameCard.propTypes = propTypes;
GameCard.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  user: state.data.user,
  room: state.data.room,
  token: state.data.token,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveHighlightCard: (roomId, playerId, cardId, token) => dispatch(highlightCard(roomId, playerId, cardId, token)),
  retrieveSelectCard: (roomId, playerId, cardId, token) => dispatch(selectCard(roomId, playerId, cardId, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GameCard));
