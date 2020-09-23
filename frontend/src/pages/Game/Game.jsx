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
import './Game.scss';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { room, userId } = this.props;
    localStorage.setItem('gameId', room.id);

    return (
      <div className="Game">
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
            {room.owner.id === userId
          && (
            <Button title="Reset game" type="Reset" />
          )}
            <Button title="Leave game" type="Leave" />
          </div>

        </div>
        <div className="GameWrapper">
          <div className="row">
            <div className="redTeamColumn col-lg-2">
              <TeamCard
                type="RED"
                cardsLeft={room.redCardsLeft}
                operativeList={room.redTeam.operatives}
                spymasterList={room.redTeam.spymasters}
              />
            </div>
            <div className="gameColumn col-lg-8">
              <div className="gameOverlay">
                {room.cards.map((card) => (
                  <GameCard id={card.id} type={card.cardColor} title={card.word} />
                ))}
              </div>
            </div>
            <div className="blueTeamColumn col-lg-2">
              <TeamCard
                type="BLUE"
                cardsLeft={room.blueCardsLeft}
                operativeList={room.blueTeam.operatives}
                spymasterList={room.blueTeam.spymasters}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userId: state.data.user.id,
  room: state.data.room,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveRoomData: (userId, roomId) => dispatch(getRoomData(userId, roomId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Game));
