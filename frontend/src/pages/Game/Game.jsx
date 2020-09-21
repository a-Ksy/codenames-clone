/* eslint-disable react/prop-types */
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import TeamCard from '../../components/TeamCard/TeamCard';
import GameCard from '../../components/GameCard/GameCard';
import './Game.scss';

const dummyData = {
  operativeList: ['Atahan', 'Barış'],
  spymasterList: ['DenizYuret'],
  cards: [
    {
      id: 2,
      title: 'araba',
      color: 'red'
    },
    {
      id: 6,
      title: 'araba',
      color: 'red'
    },
    {
      id: 7,
      title: 'araba',
      color: 'red'
    },
    {
      id: 8,
      title: 'araba',
      color: 'red'
    },
    {
      id: 9,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 10,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 11,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 18,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 19,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 3,
      title: 'araba',
      color: 'red'
    },
    {
      id: 4,
      title: 'araba',
      color: 'red'
    },
    {
      id: 5,
      title: 'araba',
      color: 'red'
    },
    {
      id: 12,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 13,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 0,
      title: 'araba',
      color: 'red'
    },
    {
      id: 1,
      title: 'araba',
      color: 'red'
    },
    {
      id: 14,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 15,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 22,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 23,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 16,
      title: 'araba',
      color: 'blue'
    },
    {
      id: 17,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 20,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 21,
      title: 'araba',
      color: 'neutral'
    },
    {
      id: 24,
      title: 'araba',
      color: 'black'
    }
  ]
};

function Game() {
  return (
    <div className="Game">
      <div className="row">
        <div className="redTeamColumn col-lg-2">
          <TeamCard
            type="red"
            cardsLeft="9"
            operativeList={dummyData.operativeList}
            spymasterList={dummyData.spymasterList}
          />
        </div>
        <div className="gameColumn col-lg-8">
          <div className="gameOverlay">
            {dummyData.cards.map(card => (
              <GameCard id={card.id}  title={card.title} />
            ))}
          </div>
        </div>
        <div className="blueTeamColumn col-lg-2">
          <TeamCard
            type="blue"
            cardsLeft="8"
            operativeList={dummyData.operativeList}
            spymasterList={dummyData.spymasterList}
          />
        </div>
      </div>
    </div>
  );
}

export default Game;
