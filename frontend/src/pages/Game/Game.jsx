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
import './Game.scss';

const dummyData = {
  operativeList: ['Atahan', 'Barış'],
  spymasterList: ['DenizYuret'],
  cards: [
    {
      id: 2,
      title: 'araba',
      color: 'red',
    },
    {
      id: 6,
      title: 'araba',
      color: 'red',
    },
    {
      id: 7,
      title: 'araba',
      color: 'red',
    },
    {
      id: 8,
      title: 'araba',
      color: 'red',
    },
    {
      id: 9,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 10,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 11,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 18,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 19,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 3,
      title: 'araba',
      color: 'red',
    },
    {
      id: 4,
      title: 'araba',
      color: 'red',
    },
    {
      id: 5,
      title: 'araba',
      color: 'red',
    },
    {
      id: 12,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 13,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 0,
      title: 'araba',
      color: 'red',
    },
    {
      id: 1,
      title: 'araba',
      color: 'red',
    },
    {
      id: 14,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 15,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 22,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 23,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 16,
      title: 'araba',
      color: 'blue',
    },
    {
      id: 17,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 20,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 21,
      title: 'araba',
      color: 'neutral',
    },
    {
      id: 24,
      title: 'araba',
      color: 'black',
    },
  ],
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { room } = this.props;
    localStorage.setItem('gameId', room.id);

    return (
      <>
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
        </div>
        <div className="Game">
          <div className="row">
            <div className="redTeamColumn col-lg-2">
              <TeamCard
                type="red"
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
                type="blue"
                cardsLeft={room.blueCardsLeft}
                operativeList={room.blueTeam.operatives}
                spymasterList={room.blueTeam.spymasters}
              />
            </div>
          </div>
        </div>
      </>
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
