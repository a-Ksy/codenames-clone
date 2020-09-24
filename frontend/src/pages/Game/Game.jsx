/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// eslint-disable-next-line import/named
import { capitalizeFirstLetterOfCapitalized } from '../../helpers/helpers';
import TeamCard from '../../components/TeamCard/TeamCard';
import GameCard from '../../components/GameCard/GameCard';
import Dropdown from '../../components/Dropdown/Dropdown';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import GameLog from '../../components/GameLog/GameLog';
import './Game.scss';
import { resetGame, setUserData } from '../../store/actions/data';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResetModalVisible: false,
      isLeaveModalVisible: false,
    };
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
      room, user, retrieveResetGame, retrieveSetUserData,
    } = this.props;
    retrieveResetGame(room.id, user.id);
    const tempUser = user;
    tempUser.playerType = 'SPECTATOR';
    tempUser.team = 'SPECTATOR';
    retrieveSetUserData(tempUser);
    this.handleModal(false, 'RESET');
  }

  handleLeaveGame = () => {
    const {
      room, user,
    } = this.props;
    // call dispatch function here
    this.handleModal(false, 'LEAVE');
  }

  render() {
    const { room, user } = this.props;
    const { isResetModalVisible, isLeaveModalVisible } = this.state;
    localStorage.setItem('gameId', room.id);

    return (
      <div className="Game">
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
              <p>
                <span className="dropdownMenuNickname">
                  {player.nickName}
                  {' '}
                  :
                </span>
                {' '}
                <span className="dropdownMenuPlayerType">
                  {capitalizeFirstLetterOfCapitalized(player.playerType)}
                </span>
              </p>
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
                  type="RED"
                  cardsLeft={room.redCardsLeft}
                  operativeList={room.redTeam.operatives}
                  spymasterList={room.redTeam.spymasters}
                />
              </div>
            </div>
            <div className="gameColumn col-lg-8">
              <div className="gameOverlay">
                {room.cards.map((card) => (
                  <GameCard id={card.id} type={card.cardColor} title={card.word} />
                ))}
              </div>
            </div>
            <div className="blueTeamColumn col-lg-2">
              <div className="teamCardBlueRow">
                <TeamCard
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
});

const mapDispatchToProps = (dispatch) => ({
  retrieveRoomData: (userId, roomId) => dispatch(getRoomData(userId, roomId)),
  retrieveResetGame: (userId, roomId) => dispatch(resetGame(userId, roomId)),
  retrieveSetUserData: (payload) => dispatch(setUserData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Game));
