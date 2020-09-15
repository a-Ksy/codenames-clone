/* eslint-disable react/prop-types */
import React from 'react';
import './Page.scss';

function Page(props) {
  const { children } = props;
  return (
    <div className="Page">
      {children}
    </div>
  );
}

export default Page;
