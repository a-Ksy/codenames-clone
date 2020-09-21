/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { createUser } from '../../store/actions/data';
import Page from '../../components/Page/Page';
import Button from '../../components/Button/Button';
import './EnterName.scss';

class EnterName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
    };
  }

  handleNickname = () => {
    const { nickname } = this.state;
    const { retrieveCreateUser } = this.props;
    retrieveCreateUser(nickname);
  }

  render() {
    return (
      <Page>
        <div className="EnterName">
          <div className="card">
            <div className="card-body">
              <h4 className="title">Welcome to code names</h4>
              <p className="subtitle">To enter or create a room, choose a nickname.</p>
              <label className="label">Nickname</label>
              <input required type="text" id="nicknameInput" placeholder="Enter your nickname" onChange={(e) => this.setState({ nickname: e.target.value })} />
              <br />
              <Button title="play now" onClick={() => this.handleNickname()} />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  retrieveCreateUser: (nickname) => dispatch(createUser(nickname)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterName);
