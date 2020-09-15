/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { getGameData } from '../../store/actions/data';
import Page from '../../components/Page/Page';
import Button from '../../components/Button/Button';
import './CreateRoom.scss';

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
    };
  }

  handleNickname = () => {
    const { nickname } = this.state;
    const { retrieveGameData } = this.props;
    console.log('buraya girdi');
    retrieveGameData(nickname);
  }

  render() {
    return (
      <Page>
        <div className="CreateRoom">
          <div className="card">
            <div className="card-body">
              <h4 className="title">Welcome to code names</h4>
              <p className="subtitle">To enter a room, choose a nickname.</p>
              <label className="label">Nickname</label>
              <input required type="text" id="nicknameInput" placeholder="Enter your nickname" onChange={(e) => this.setState({ nickname: e.target.value })} />
              <br />
              <Button title="create room" onClick={() => this.handleNickname()} />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  gameData: state.data.gameData,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveGameData: (nickname) => dispatch(getGameData(nickname)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
