/* eslint-disable valid-typeof */
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
  async componentDidMount() {
    const {
      retrieveCheckSession, retrieveCheckGameSession, isInGame,
    } = this.props;
    const userId = localStorage.getItem('userId');
    const nickName = localStorage.getItem('nickName');
    const gameId = localStorage.getItem('gameId');
    const token = localStorage.getItem('token');
    if (userId !== null || nickName !== null || token !== null) {
      await retrieveCheckSession(userId, nickName, token);
      if (gameId !== null) {
        retrieveCheckGameSession(userId, gameId, token);
        if (!isInGame) localStorage.removeItem('gameId');
      }
    }
  }

  render() {
    const {
      isLoggedIn, room, user, isInGame, token,
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
      if (token !== undefined) {
        localStorage.setItem('token', token);
      }
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
  token: state.data.token,
  isInGame: state.data.isInGame,
});

const mapDispatchToProps = (dispatch) => ({
  retrieveCheckSession: (userId, nickName, token) => dispatch(actions.checkSession(userId, nickName, token)),
  retrieveCheckGameSession: (userId, gameId, token) => dispatch(actions.checkRoomSession(userId, gameId, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
