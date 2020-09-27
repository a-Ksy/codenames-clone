/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';
import {
  createRoom, getRoomData, checkRoomSession, setUserData, getRoomsData,
} from '../../store/actions/data';
import Button from '../../components/Button/Button';
import './Rooms.scss';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
    };
  }

  componentDidMount() {
    const {
      room, user, retrieveSetUserData,
    } = this.props;
    const tempUser = user;
    if (room === null && (tempUser.playerType !== 'SPECTATOR' || tempUser.team !== 'SPECTATOR')) {
      tempUser.playerType = 'SPECTATOR';
      tempUser.team = 'SPECTATOR';
      retrieveSetUserData(tempUser);
    }
  }

  handleCreateRoom = async (history) => {
    const { roomName } = this.state;
    const { retrieveCreateRoom, user } = this.props;
    await retrieveCreateRoom(user.id, roomName);
    history.push('/game');
  }

  handleJoinRoom = async (roomId, history) => {
    const { retrieveRoomData, user } = this.props;
    await retrieveRoomData(user.id, roomId);
    history.push('/game');
  }

  handleRefreshRooms = () => {
    const { retrieveRoomsData } = this.props;
    retrieveRoomsData();
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
    const { rooms } = this.props;

    return (
      <div className="Rooms">
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
                      <td className="joinButton" role="gridcell" onClick={() => this.handleJoinRoom(room.id, history)}>
                        <i className="fa fa-sign-in" aria-hidden="true" />
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
});

const mapDispatchToProps = (dispatch) => ({
  retrieveCreateRoom: (userId, roomName) => dispatch(createRoom(userId, roomName)),
  retrieveRoomData: (userId, roomId) => dispatch(getRoomData(userId, roomId)),
  retrieveSetUserData: (payload) => dispatch(setUserData(payload)),
  retrieveCheckRoomSession: (userId, roomId) => dispatch(checkRoomSession(userId, roomId)),
  retrieveRoomsData: () => dispatch(getRoomsData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rooms));
