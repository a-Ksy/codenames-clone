/* eslint-disable react/prop-types */
import React from 'react';
import './Container.scss';

function Container(props) {
  const { children, type } = props;
  return (
    <div className={`container-lg ${type}`}>
      {children}
    </div>
  );
}

export default Container;
