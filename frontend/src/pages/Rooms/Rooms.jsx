/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import * as actions from '../../store/actions';
import Button from '../../components/Button/Button';
import { getRoomsData, createRoom } from '../../store/actions/data';
import './Rooms.scss';


const dummyData = [
  {
    id: 0,
    name: "Atahan's room",
    owner: "Atahan",
    players: 3,
    status: "WAITS_FOR_PLAYER",
  },
  {
    id: 1,
    name: "Barıs's room",
    owner: "Barış",
    players: 5,
    status: "IN_PROGRESS",
  },
  {
    id: 2,
    name: "DenizYuret's room",
    owner: "Deniz Yuret",
    players: 2,
    status: "WAITS_FOR_PLAYER",
  },
    {
    id: 3,
    name: "Atahan's room",
    owner: "Atahan",
    players: 3,
    status: "WAITS_FOR_PLAYER",
  },
  {
    id: 4,
    name: "Barıs's room",
    owner: "Barış",
    players: 5,
    status: "IN_PROGRESS",
  },
  {
    id: 5,
    name: "DenizYuret's room",
    owner: "Deniz Yuret",
    players: 2,
    status: "WAITS_FOR_PLAYER",
  },
]

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
    };
  }

  handleCreateRoom = () => {
    const { roomName } = this.state;
    const { createRoom, userId } = this.props;
    //createRoom(userId, roomName); 
  }

  handleJoinRoom = (roomId) => {
    const { retrieveRoomData, userId } = this.props;
    //retrieveRoomData(userId, roomId);
  }

  statusPrettier = (status) => {
    switch (status) {
      case 'WAITS_FOR_PLAYER':
        return 'Waiting for players'
      case 'IN_PROGRESS':
        return 'Game in progress'
    }
  }

  render() {

    const { room } = this.props;

    return (
        <div className="Rooms">
          <div className="row">
            <div className="roomsColumn col-lg-8">
              <h1 className="title">Join an existing room</h1>
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Room Name</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Players</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.map(room => 
                  <tr key={room.id}>
                      <td>{room.name}</td>
                      <td>{room.owner}</td>
                      <td>{room.players}</td>
                      <td>{this.statusPrettier(room.status)}</td>
                      <td className="joinButton" onClick={() => this.handleJoinRoom(room.id)}>
                        <NavLink to={`/game/${room.id}`}>
                        <i className="fa fa-sign-in" aria-hidden="true"></i>
                        Join
                        </NavLink>
                      </td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="createRoomColumn col-lg-3 offset-lg-1">
              <h1 className="title">Create a room</h1>
              <label className="label">Room Name</label>
              <input required type="text" id="roomNameInput" placeholder="Enter a room name" onChange={(e) => this.setState({ roomName: e.target.value })} />
                <NavLink to={`/game/${room.roomId}`}><Button title="create a room" onClick={() => this.handleCreateRoom()} /></NavLink>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userId: state.data.userId,
  room: state.data.room,
});

const mapDispatchToProps = (dispatch) => ({
  createRoom: (userId, roomName) => dispatch(createRoom(roomName)),
  retrieveRoomData: (userId, roomId) => dispatch(actions.getRoomData(userId, roomId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rooms));
