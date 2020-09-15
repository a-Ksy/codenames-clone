/* eslint-disable react/prop-types */
import React from 'react';
import './Button.scss';

function Button(props) {
  const { title, type, onClick } = props;
  return (
    <button type="button" className={`Button ${type}`} onClick={onClick}>
      {title}
    </button>
  );
}

export default Button;
