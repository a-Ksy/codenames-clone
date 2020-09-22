import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import variables from '../../sass/_variables.scss';
import './GameCard.scss';

const propTypes = {
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  type: '',
};

function GameCard(props) {
  const { type, title } = props;
  return (
    <div className="GameCard">
      <div className={`GameCardPlot ${type}`}>
        <h1 className="title">{title}</h1>
      </div>
    </div>
  );
}

GameCard.propTypes = propTypes;
GameCard.defaultProps = defaultProps;

export default GameCard;
