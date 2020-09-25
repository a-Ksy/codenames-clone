/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './GameCard.scss';

const propTypes = {
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool,
};

const defaultProps = {
  type: '',
};

function GameCard(props) {
  const {
    type, title, isHighlighted, highlighterNames,
  } = props;
  const { user, room } = props;
  const { playerType, team } = user;
  const { gameStatus } = room;

  let button = null;
  if ((playerType === 'OPERATIVE') && ((gameStatus === 'RED_TEAM_OPERATIVE_ROUND' && team === 'RED') || (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND' && team === 'BLUE'))) {
    button = (
      <div className="buttonBox justify-content-end">
        <i className="em em-heavy_check_mark" aria-label="HEAVY CHECK MARK" />
      </div>
    );
  }

  return (
    <div className="GameCard">
      <div className={`GameCardPlot ${type} `}>
        {button}
        <h1 className="title">{title}</h1>
      </div>
    </div>
  );
}

GameCard.propTypes = propTypes;
GameCard.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  user: state.data.user,
  room: state.data.room,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GameCard));
