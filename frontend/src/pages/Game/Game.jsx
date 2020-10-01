/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// eslint-disable-next-line import/named
import { Client } from '@stomp/stompjs';
import { capitalizeFirstLetterOfCapitalized } from '../../helpers/helpers';
import TeamCard from '../../components/TeamCard/TeamCard';
import GameCard from '../../components/GameCard/GameCard';
import Dropdown from '../../components/Dropdown/Dropdown';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import GameLog from '../../components/GameLog/GameLog';
import GiveClue from '../../components/GiveClue/GiveClue';
import './Game.scss';
import {
  leaveGame, resetGame, setUserData, kickPlayer, checkRoomSession, getKickedData, endGuess,
} from '../../store/actions/data';
import RoundInfo from '../../components/RoundInfo/RoundInfo';
import Clue from '../../components/Clue/Clue';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResetModalVisible: false,
      isLeaveModalVisible: false,
    };
    this.client = new Client();
  }

  componentDidMount() {
    const {
      room, user, retrieveCheckRoomSession, retrieveSetUserData, retrieveKickedGame, token, retrieveLeaveGame,
    } = this.props;

    const headers = {
      playerId: user.id,
    };

    this.client.configure({
      brokerURL: 'ws://localhost:8080/stomp',
      onConnect: () => {
        this.client.subscribe(`/topic/kick/${user.id}`, () => {
          this.client.unsubscribe(`/topic/updateGame/${room.id}`);
          const tempUser = user;
          tempUser.playerType = 'SPECTATOR';
          tempUser.team = 'SPECTATOR';
          retrieveSetUserData(tempUser);
          retrieveKickedGame(token);
        });
        this.client.subscribe(`/topic/updateGame/${room.id}`, () => {
          retrieveCheckRoomSession(user.id, room.id, token);
        });
      },
      onWebSocketClose: () => {
        retrieveLeaveGame(user.id, room.id, token);
      },
    });

    this.client.connectHeaders = headers;
    this.client.activate();
  }

  handleModalVisibility = (isModalVisible) => {
    const { isResetModalVisible, isLeaveModalVisible } = this.state;
    if (isResetModalVisible) {
      this.setState({ isResetModalVisible: isModalVisible });
    } else if (isLeaveModalVisible) {
      this.setState({ isLeaveModalVisible: isModalVisible });
    }
  }

  handleModal = (boolean, type) => {
    if (type === 'RESET') {
      this.setState({ isResetModalVisible: boolean });
    } else if (type === 'LEAVE') {
      this.setState({ isLeaveModalVisible: boolean });
    }
  }

  handleResetGame = () => {
    const {
      room, user, retrieveResetGame, retrieveSetUserData, token,
    } = this.props;
    retrieveResetGame(room.id, user.id, token);
    const tempUser = user;
    tempUser.playerType = 'SPECTATOR';
    tempUser.team = 'SPECTATOR';
    retrieveSetUserData(tempUser);
    this.handleModal(false, 'RESET');
  }

  handleLeaveGame = () => {
    const {
      room, user, retrieveLeaveGame, retrieveSetUserData, token,
    } = this.props;
    retrieveLeaveGame(room.id, user.id, token);
    const tempUser = user;
    tempUser.playerType = 'SPECTATOR';
    tempUser.team = 'SPECTATOR';
    retrieveSetUserData(tempUser);
    this.handleModal(false, 'LEAVE');
  }

  handleKickPlayer = (playerId) => {
    const { room, retrieveKickPlayer, token } = this.props;
    retrieveKickPlayer(room.id, playerId, token);
  }

  handleEndGuess = () => {
    const {
      room, user, retrieveEndGuess, token,
    } = this.props;
    retrieveEndGuess(room.id, user.id, token);
  }

  render() {
    const {
      room, user, retrieveCheckRoomSession, token, retrieveSetUserData,
    } = this.props;
    const { isResetModalVisible, isLeaveModalVisible } = this.state;
    localStorage.setItem('gameId', room.id);
    if (!room.players.filter((player) => player.id === user.id).online) {
      console.log(room.players.filter((player) => player.id === user.id));
    }

    let hintBox = ((room.gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND' || room.gameStatus === 'RED_TEAM_OPERATIVE_ROUND')
      && <Clue />);

    if (((room.gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND' && user.playerType === 'OPERATIVE' && user.team === 'BLUE') || (room.gameStatus === 'RED_TEAM_OPERATIVE_ROUND' && user.playerType === 'OPERATIVE' && user.team === 'RED'))) {
      hintBox = (
        <div className="ClueRow row">
          <Clue />
          <Button title="End guess" onClick={() => { this.handleEndGuess(); }} />
        </div>
      );
    }

    return (
      <div className={`Game ${room.gameStatus}`}>
        <Modal
          title="Are you sure to reset game?"
          paragraph="This will reset all the game progress, do you wish to continue?"
          buttonTitle="Reset game"
          onClick={() => this.handleResetGame()}
          show={isResetModalVisible}
          handleModalVisibility={this.handleModalVisibility}
        />
        <Modal
          title="Are you sure to leave game?"
          buttonTitle="Leave game"
          onClick={() => this.handleLeaveGame()}
          show={isLeaveModalVisible}
          handleModalVisibility={this.handleModalVisibility}
        />

        <div className="header row justify-content-between">
          <Dropdown title="Players">
            <p className="dropdownMenuTitle">Players in this room</p>
            {room.players.map((player) => (
              <div key={player.id} className="dropdownRow row justify-content-between">
                <div>
                  <p>
                    <span className="dropdownMenuNickname">
                      {player.nickName}
                      :
                    </span>
                    {' '}
                    <span className="dropdownMenuPlayerType">
                      {player.online ? capitalizeFirstLetterOfCapitalized(player.playerType) : 'AFK' }
                    </span>
                    {' '}
                    <span className="dropdownMenuHost">
                      {player.id === room.owner.id && '(host)'}
                    </span>
                  </p>
                </div>
                {(user.id === room.owner.id && player.id !== user.id)
                  && <i className="fa fa-ban" aria-hidden="true" onClick={() => this.handleKickPlayer(player.id)} />}
              </div>
            ))}
          </Dropdown>

          <div className="optionsBox">
            {room.owner.id === user.id
          && (
          <Button title="Reset game" type="Reset" onClick={() => this.handleModal(true, 'RESET')} />
          )}
            <Button title="Leave game" type="Leave" onClick={() => this.handleModal(true, 'LEAVE')} />
          </div>

        </div>
        <div className="GameWrapper">
          <div className="row">
            <div className="redTeamColumn col-lg-2">
              <div className="teamCardRedRow">
                <TeamCard
                  client={this.client}
                  type="RED"
                  cardsLeft={room.redCardsLeft}
                  operativeList={room.redTeam.operatives}
                  spymasterList={room.redTeam.spymasters}
                />
              </div>
            </div>
            <div className="gameColumn col-lg-8">
              <RoundInfo />
              <div className="gameOverlay">
                {room.cards.map((card) => (
                  <GameCard
                    id={card.id}
                    key={card.id}
                    type={card.cardColor}
                    title={card.word}
                    highlighters={card.highlighters}
                    cardStatus={card.cardStatus}
                  />
                ))}
              </div>
              {((room.gameStatus === 'BLUE_TEAM_SPYMASTER_ROUND' && user.playerType === 'SPYMASTER' && user.team === 'BLUE') || (room.gameStatus === 'RED_TEAM_SPYMASTER_ROUND' && user.playerType === 'SPYMASTER' && user.team === 'RED'))
                && <GiveClue />}
              {hintBox}
            </div>
            <div className="blueTeamColumn col-lg-2">
              <div className="teamCardBlueRow">
                <TeamCard
                  client={this.client}
                  type="BLUE"
                  cardsLeft={room.blueCardsLeft}
                  operativeList={room.blueTeam.operatives}
                  spymasterList={room.blueTeam.spymasters}
                />
              </div>
              <div className="gameLogRow">
                <GameLog logs={room.logs} />
              </div>
            </div>
          </div>
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
  retrieveCheckRoomSession: (userId, roomId, token) => dispatch(checkRoomSession(userId, roomId, token)),
  retrieveKickedGame: (token) => dispatch(getKickedData(token)),
  retrieveResetGame: (userId, roomId, token) => dispatch(resetGame(userId, roomId, token)),
  retrieveSetUserData: (payload) => dispatch(setUserData(payload)),
  retrieveLeaveGame: (roomId, userId, token) => dispatch(leaveGame(roomId, userId, token)),
  retrieveKickPlayer: (roomId, playerId, token) => dispatch(kickPlayer(roomId, playerId, token)),
  retrieveEndGuess: (roomId, playerId, token) => dispatch(endGuess(roomId, playerId, token)),

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Game));
