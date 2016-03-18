import React from 'react';
import { connect } from 'react-redux';
import Menu from './Menu';

const AppScreen = (props) => {
  return (
    <div>
      <Menu/>
      <h1>App Screen</h1>
      <div>isLoggedIn: {props.isLoggedIn}</div>
      {props.children}
    </div>
  );
};
AppScreen.propTypes = {
  isLoggedIn : React.PropTypes.bool,
  children : React.PropTypes.node
};

const mapStateToProps = state => {
  return state.account.toJS();
};

export default connect(mapStateToProps)(AppScreen);
