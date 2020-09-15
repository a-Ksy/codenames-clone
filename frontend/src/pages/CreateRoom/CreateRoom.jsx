/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React from 'react';
import Page from '../../components/Page/Page';
import Button from '../../components/Button/Button';
import './CreateRoom.scss';

function CreateRoom() {
  return (
    <Page>
      <div className="CreateRoom">
        <div className="card">
          <div className="card-body">
            <h4 className="title">Welcome to code names</h4>
            <p className="subtitle">To enter a room, choose a nickname.</p>
            <label className="label">Nickname</label>
            <input type="text" id="nicknameInput" placeholder="Enter your nickname" />
            <br />
            <Button title="create room" />
          </div>
        </div>
      </div>
    </Page>
  );
}

export default CreateRoom;
