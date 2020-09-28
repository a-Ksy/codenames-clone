/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './GiveClue.scss';
import { giveClue } from '../../store/actions/data';

class GiveClue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clueWord: '',
      clueNumber: 1,
    };
  }

  handleGiveClue = () => {
    const { clueWord, clueNumber } = this.state;
    const {
      user, room, retrieveGiveClue, token,
    } = this.props;
    retrieveGiveClue(room.id, clueWord, clueNumber, user.id, token);
  }

  render() {
    return (
      <div className="GiveClue">
        <p className="title">
          Give your operatives a clue and number of cards they should try to guess
        </p>
        <div>
          <form className="form-inline">
            <div className="form-group">
              <input type="text" className="form-control" id="inputPassword2" placeholder="Type your clue" onChange={(e) => this.setState({ clueWord: e.target.value })} />
              <select className="form-control" onChange={(e) => this.setState({ clueNumber: e.target.value })}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
              </select>
              <Button title="Give clue" type="Clue" onClick={() => this.handleGiveClue()} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.data.user,
  room: state.data.room,
  token: state.data.token,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveGiveClue: (roomId, clueWord, clueNumber, playerId, token) => dispatch(giveClue(roomId, clueWord, clueNumber, playerId, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GiveClue));
