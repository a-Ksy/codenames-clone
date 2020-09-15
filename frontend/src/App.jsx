import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import LoadingPage from './components/Loading/Loading';
import Container from './components/Container/Container';
import LandingPage from './pages/Landing/Landing';
import CreateRoomPage from './pages/CreateRoom/CreateRoom';
import './App.scss';

class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <LoadingPage />
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
              path="/room/create"
              render={() => (
                <>
                  <CreateRoomPage />
                </>
              )}
            />
          </Switch>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // session: state.auth.session,
});

const mapDispatchToProps = (dispatch) => ({
  // checkSession: () => dispatch(actions.checkSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
