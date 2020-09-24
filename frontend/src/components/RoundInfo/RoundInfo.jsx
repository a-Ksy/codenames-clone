/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './RoundInfo.scss';

const RoundInfo = (props) => (
  <div className="RoundInfo">
    <p className="title">
      Selam
    </p>
  </div>
);

const mapStateToProps = (state) => ({
  user: state.data.user,
  room: state.data.room,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoundInfo));
