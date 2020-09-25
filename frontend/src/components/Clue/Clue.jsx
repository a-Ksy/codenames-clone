/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getRoundInfo } from '../../helpers/helpers';
import './Clue.scss';

function Clue(props) {
  const { room } = props;
  const { clueWord, clueNumber } = room;

  return (
    <div className="Clue">
      <div className="clueBox">
        <p className="title">
          <p>
            <span className="clueText">Clue:</span>
            {' '}
            {clueWord}
            {' '}
            {clueNumber}
          </p>
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  room: state.data.room,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Clue));
