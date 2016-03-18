import React from 'react';
import { connect } from 'react-redux';

const Screen = () => (
  <div>
    <h1>VoteBox</h1>
    <p>Hello.</p>
  </div>
);

const VoteBox = connect()(Screen);

export default VoteBox;
