import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import LoadingPage from './components/Loading/Loading';
import Container from './components/Container/Container';
import LandingPage from './pages/Landing/Landing';
import EnterNamePage from './pages/EnterName/EnterName';
import RoomsPage from './pages/Rooms/Rooms';
import './App.scss';

class App extends React.Component {
  componentDidMount() {
  }

  render() {

    const { isLoggedIn } = this.props;
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
            path="/room"
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
});

const mapDispatchToProps = (dispatch) => ({
  // checkSession: () => dispatch(actions.checkSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
