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
    const { retrieveCheckSession } = this.props;
    const userId = localStorage.getItem('userId');
    const nickName = localStorage.getItem('nickName');

    if (userId !== null && nickName !== null) {
      retrieveCheckSession(userId, nickName);
    }
  }

  render() {
    const { isLoggedIn, room, user } = this.props;

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
            <Route
              exact
              path="/rooms"
              render={() => (
                <>
                  <RoomsPage />
                </>
              )}
            />
            <Route
              path="/game"
              render={() => room !== undefined
                  && <GamePage />}
            />
            <Redirect to="/rooms" />
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
});

const mapDispatchToProps = (dispatch) => ({
  retrieveCheckSession: (userId, nickName) => dispatch(actions.checkSession(userId, nickName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
