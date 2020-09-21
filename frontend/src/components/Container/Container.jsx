import React from 'react';
import PropTypes from 'prop-types';
import './Container.scss';

const propTypes = {
  type: PropTypes.string,
};

const defaultProps = {
  type: 'menu',
};

function Container(props) {
  const { children, type } = props;
  return (
    <div className={`container-lg ${type}`}>
      {children}
    </div>
  );
}

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
