import React from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  paragraph: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  onClick: () => { },
  paragraph: '',
};

function Modal(props) {
  const {
    // eslint-disable-next-line react/prop-types
    title, buttonTitle, onClick, show, handleModalVisibility, paragraph, children,
  } = props;
  return (
    <div className={`modal fade ${show && 'show'}`} style={{ display: `${show ? 'block' : 'none'}` }}>
      <div className="modal-dialog modal-dialog-centered " role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="Modal">{title}</h5>
            <button type="button" className="close" onClick={() => handleModalVisibility(false)}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {paragraph !== '' && <p>{paragraph}</p>}
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => handleModalVisibility(false)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onClick}>{buttonTitle}</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" />
    </div>
  );
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
