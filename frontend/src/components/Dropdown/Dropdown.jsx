import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
};

function Dropdown(props) {
  const { title, children } = props;
  return (
    <div className="Dropdown btn-group">
      <button className="btn btn-custom btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        { title }
      </button>
      <div className="dropdown-menu">
        { children }
      </div>
    </div>

  );
}

Dropdown.propTypes = propTypes;

export default Dropdown;
