import React from 'react';
import "./user.scss";

const User = (props) => {
  const {id, name, color} = props;

  const userStyle = {
    backgroundColor: color
  };

  return (
    <div className="user" style={userStyle}>
      <span className="userId">{id}</span>
      <span className="userName">{name}</span>
    </div>
  );
};

User.propTypes = {
  id: React.PropTypes.number.isRequired,
  name : React.PropTypes.string.isRequired,
  color : React.PropTypes.string.isRequired
};

export default User;