/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Route, Switch, Redirect, useHistory,
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import LoadingPage from './components/Loading/Loading';
import Container from './components/Container/Container';
import LandingPage from './pages/Landing/Landing';
import EnterNamePage from './pages/EnterName/EnterName';
import RoomsPage from './pages/Rooms/Rooms';
import GamePage from './pages/Game/Game';
import './App.scss';

class App extends React.Component {
  componentDidMount() {
    const {
      retrieveCheckSession, retrieveCheckGameSession, isLoggedIn, isInGame,
    } = this.props;
    const userId = localStorage.getItem('userId');
    const nickName = localStorage.getItem('nickName');
    const gameId = localStorage.getItem('gameId');
    if (userId !== null && nickName !== null) {
      retrieveCheckSession(userId, nickName);
      if (!isLoggedIn) {
        localStorage.removeItem('userId');
        localStorage.removeItem('nickName');
        localStorage.removeItem('gameId');
      }
      if (gameId !== null) {
        retrieveCheckGameSession(userId, gameId);
        if (!isInGame) localStorage.removeItem('gameId');
      }
    }
  }

  render() {
    const {
      isLoggedIn, room, user, isInGame,
    } = this.props;

    let routes = (
      <Container>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <LandingPage />
              </>
            )}
          />
          <Route
            exact
            path="/join"
            render={() => (
              <>
                <EnterNamePage />
              </>
            )}
          />
          <Redirect to="/" />
        </Switch>
      </Container>
    );

    if (isLoggedIn) {
      localStorage.setItem('userId', user.id);
      localStorage.setItem('nickName', user.nickName);
      routes = (
        <Container type="game">
          <Switch>
            {isInGame
              ? (
                <>
                  <Route
                    path="/game"
                    render={() => room !== undefined
                      && <GamePage />}
                  />
                  <Redirect to="/game" />
                </>
              ) : (
                <>
                  <Route
                    exact
                    path="/rooms"
                    render={() => (
                      <>
                        <RoomsPage />
                      </>
                    )}
                  />
                  <Redirect to="/rooms" />
                </>
              )}
          </Switch>
        </Container>
      );
    }

    return (
      <div className="App">
        <LoadingPage />
        {routes}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.data.loggedIn,
  room: state.data.room,
  user: state.data.user,
  isInGame: state.data.isInGame,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveCheckSession: (userId, nickName) => dispatch(actions.checkSession(userId, nickName)),
  retrieveCheckGameSession: (userId, gameId) => dispatch(actions.checkRoomSession(userId, gameId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
