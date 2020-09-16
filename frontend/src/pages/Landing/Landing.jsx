/* eslint-disable react/prop-types */
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Page from '../../components/Page/Page';
import Button from '../../components/Button/Button';
import './Landing.scss';

function Landing() {
  return (
    <Page>
      <div className="Landing">
        <div className="header">
          <h1 className="title">code names</h1>
          <h2 className="subtitle">Play with your friends</h2>
          <NavLink to="/join"><Button title="play now" /></NavLink>
        </div>
        <div className="rules">
          <h3 className="title">How to play:</h3>
          <p className="subtitle">1. Click on the play now button.</p>
          <p className="subtitle">2. Enter a room or create a new room.</p>
          <p className="subtitle">3. Share the room URL with your friends.</p>
          <p className="subtitle">4. Enjoy the game!</p>
        </div>
        <div className="footer">
          <p>This is a clone for the Codenames board game. Please note that this website is not the official Codenames.</p>
          <p>
            Please visit
            <a target="_blank" rel="noreferrer" href="https://codenames.game/"> Codenames </a>
            for the original game.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default withRouter(Landing);
