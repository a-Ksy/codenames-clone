/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';
import {
  createRoom, getRoomData, checkRoomSession, setUserData, getRoomsData, setToken,
} from '../../store/actions/data';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import './Rooms.scss';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomId: '',
      roomPassword: null,
      inputPassword: null,
      hasPassword: false,
      isPrivate: false,
      isModalVisible: false,
    };

    const initialState = {
      roomName: '',
      roomId: '',
      roomPassword: null,
      inputPassword: null,
      hasPassword: false,
      isPrivate: false,
      isModalVisible: false,
    };
  }

  componentDidMount() {
    const {
      room, user, retrieveSetUserData, token, retrieveSetToken,
    } = this.props;
    const tempUser = user;
    if (localStorage.getItem('token') !== null) {
      retrieveSetToken(localStorage.getItem('token'));
    }
    if (room === null && (tempUser.playerType !== 'SPECTATOR' || tempUser.team !== 'SPECTATOR')) {
      tempUser.playerType = 'SPECTATOR';
      tempUser.team = 'SPECTATOR';
      retrieveSetUserData(tempUser);
    }
  }

  handleCreateRoom = async (history) => {
    const { roomName, roomPassword } = this.state;
    const { retrieveCreateRoom, user, token } = this.props;
    await retrieveCreateRoom(user.id, roomName, roomPassword, token);
    const { room } = this.props;
    if (room !== null && room !== undefined) {
      history.push('/game');
    }
  }

  handleJoinRoom = async (roomId, hasPassword, history) => {
    const {
      retrieveRoomData, user, token, status,
    } = this.props;
    if (hasPassword) {
      this.setState({ hasPassword, roomId });
      this.handleModal(true);
      return;
    }
    const { inputPassword } = this.state;
    if (inputPassword !== null && inputPassword !== '') {
      document.getElementById('gamePasswordInput').value = '';
    }
    await retrieveRoomData(user.id, roomId, inputPassword, token);
    const { room } = this.props;
    if (room !== null && room !== undefined && status !== 'KICKED_FROM_GAME' && status !== 'INVALID_PASSWORD') {
      if (status === 'INVALID_PASSWORD') {
        this.setState(initialState);
        document.getElementById('gamePasswordInput').value = '';
      }
      history.push('/game');
    } else {
      this.handleModal(true);
    }
  }

  handleModalVisibility = (_isModalVisible) => {
    const { isModalVisible } = this.state;
    const { status } = this.props;
    if (isModalVisible) {
      this.setState({ isModalVisible: _isModalVisible });
      if (status === 'INVALID_PASSWORD') {
        document.getElementById('gamePasswordInput').value = '';
      }
    }
  }

  handleModal = (boolean) => {
    this.setState({ isModalVisible: boolean });
  }

  handleRefreshRooms = () => {
    const { retrieveRoomsData, token } = this.props;
    retrieveRoomsData(token);
  }

  statusPrettier = (status) => {
    switch (status) {
      case 'WAITS_FOR_PLAYER':
        return 'Waiting for players';
      case 'IN_PROGRESS':
        return 'Game in progress';
      default:
        return 'Waiting for players';
    }
  }

  render() {
    const { rooms, status } = this.props;
    const {
      isModalVisible, isPrivate, hasPassword, roomId,
    } = this.state;
    let modal;
    if (status === 'KICKED_FROM_GAME') {
      modal = (
        <Modal
          title="You are not allowed to join"
          paragraph="You were kicked from the game."
          buttonTitle="Okay"
          onClick={() => this.handleModal(false)}
          show={isModalVisible}
          handleModalVisibility={this.handleModalVisibility}
        />
      );
    }
    if (hasPassword) {
      modal = (
        <Route render={({ history }) => (
          <Modal
            title="This room is private"
            buttonTitle="Submit"
            onClick={() => this.handleJoinRoom(roomId, false, history)}
            show={isModalVisible}
            handleModalVisibility={this.handleModalVisibility}
          >
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                id="gamePasswordInput"
                placeholder="Enter the password"
                onChange={(e) => this.setState({ inputPassword: e.target.value })}
              />
              {(status === 'INVALID_PASSWORD' && document.getElementById('gamePasswordInput') !== null && document.getElementById('gamePasswordInput').value === '') && <p className="invalidPasswordText">Wrong password</p>}
            </div>
          </Modal>
        )}
        />
      );
    }

    return (
      <div className="Rooms">
        {modal}
        <div className="row">
          <div className="roomsColumn col-lg-8">
            <div className="roomsTitleRow row justify-content-between">
              <h1 className="title">Join an existing room</h1>
              <i className="fa fa-refresh" aria-hidden="true" onClick={() => { this.handleRefreshRooms(); }} />
            </div>
            <table className="table table-borderless" role="grid">
              <thead>
                <tr>
                  <th scope="col">Room Name</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Players</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.gameName}</td>
                    <td>{room.owner.nickName}</td>
                    <td>{room.players.length}</td>
                    <td>{this.statusPrettier(room.gameStatus)}</td>
                    <Route render={({ history }) => (
                      <td className="joinButton" role="gridcell" onClick={() => this.handleJoinRoom(room.id, room.hasPassword, history)}>
                        {room.hasPassword
                        && <i className="fa fa-lock" aria-hidden="true" />}
                        Join
                      </td>
                    )}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="createRoomColumn col-lg-3 offset-lg-1">
            <h1 className="title">Create a room</h1>
            <label className="label">Room Name</label>
            <input required type="text" id="roomNameInput" placeholder="Enter a room name" onChange={(e) => this.setState({ roomName: e.target.value })} />
            <label className="form-check-label" htmlFor="roomPrivateInput">
              <input type="checkbox" value="" id="roomPrivateInput" onClick={() => this.setState({ isPrivate: !isPrivate })} />
              Private room
            </label>
            {isPrivate
              && (
              <div>
                <label className="label">Password</label>
                <input required type="password" id="roomPasswordInput" placeholder="Enter a password" onChange={(e) => this.setState({ roomPassword: e.target.value })} />
              </div>
              )}

            <Route render={({ history }) => (
              <Button title="create a room" onClick={() => this.handleCreateRoom(history)} />
            )}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.data.user,
  rooms: state.data.rooms,
  room: state.data.room,
  token: state.data.token,
  status: state.data.status,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveCreateRoom: (userId, roomName, password, token) => dispatch(createRoom(userId, roomName, password, token)),
  retrieveRoomData: (userId, roomId, password, token) => dispatch(getRoomData(userId, roomId, password, token)),
  retrieveSetToken: (token) => dispatch(setToken(token)),
  retrieveSetUserData: (payload) => dispatch(setUserData(payload)),
  retrieveCheckRoomSession: (userId, roomId, token) => dispatch(checkRoomSession(userId, roomId, token)),
  retrieveRoomsData: (token) => dispatch(getRoomsData(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rooms));
