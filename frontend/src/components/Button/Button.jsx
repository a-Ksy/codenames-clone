import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';


const propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
};

const defaultProps = {
  type: '',
  onClick: () => { },
  color: '',
};


function Button(props) {
  const { title, type, onClick, color } = props;
  return (
    <button style={{backgroundColor:color}} type="button" className={`Button ${type}`} onClick={onClick}>
      {title}
    </button>
  );
}


Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
