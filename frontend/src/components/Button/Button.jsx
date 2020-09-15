/* eslint-disable react/prop-types */
import React from 'react';
import './Button.scss';

function Button(props) {
  const { title, type } = props;
  return (
    <button type="button" className={`Button ${type}`}>
      {title}
    </button>
  );
}

export default Button;
