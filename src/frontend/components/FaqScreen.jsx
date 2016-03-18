import React from 'react';
import { connect } from 'react-redux';

const Screen = () => (
  <div>
    <h1>VoteBox-FAQ</h1>
  </div>
);

const FaqScreen = connect(state => state)(Screen);

export default FaqScreen;
