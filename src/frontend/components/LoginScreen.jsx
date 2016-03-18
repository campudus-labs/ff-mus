import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/actionCreators';

class Screen extends React.Component {

  render() {
    return (
      <div>
        <h1>VoteBox</h1>
        <form onSubmit={() => this.onSubmit()}>
          <input ref="username" type="text" name="username" placeholder="Username"/>
          <input ref="password" type="password" name="password" placeholder="Password"/>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  onSubmit() {
    const name = this.refs.username;
    const pass = this.refs.password;
    this.props.dispatch(login(name, pass));
  }

}
Screen.propTypes = {
  dispatch: React.PropTypes.func
};

const LoginScreen = connect(state => state)(Screen);

export default LoginScreen;
