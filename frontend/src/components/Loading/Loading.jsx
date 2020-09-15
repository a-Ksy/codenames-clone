/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BounceLoader from 'react-spinners/BounceLoader';
import variables from '../../sass/_variables.scss';
import './Loading.scss';

const propTypes = {
  loadingData: PropTypes.bool.isRequired,
};

const Loading = (props) => {
  const { loadingData } = props;
  let content = null;
  if (loadingData) {
    content = (
      <div className="fullDim">
        <BounceLoader
          size={100}
          color={variables.primary}
        />
      </div>
    );
  }

  return (
    content
  );
};

const mapStateToProps = (state) => ({
  loadingData: state.data.loading,
});

Loading.propTypes = propTypes;
export default connect(mapStateToProps)(Loading);
