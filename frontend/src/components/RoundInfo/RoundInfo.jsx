/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getRoundInfo } from '../../helpers/helpers';
import './RoundInfo.scss';

function RoundInfo(props) {
  const { user, room } = props;
  const { playerType, team } = user;
  const { gameStatus } = room;

  return (
    <div className="RoundInfo">
      <p className="title">
        {getRoundInfo(playerType, team, gameStatus)}
      </p>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.data.user,
  room: state.data.room,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoundInfo));
