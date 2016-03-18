import React from 'react';
import "./tile.scss";
import {userClick} from "../actions/actionCreators";
import { connect } from 'react-redux';

const Tile = (props) => {
  const {number, width, height, color} = props;

  const tileStyle = {
    width : width + "px",
    height : height + "px",
    backgroundColor : color
  };

  const onClick = (event) => {
    props.dispatch(userClick(number, "#ff0000"));
  };

  return (
    <div onClick={onClick} className="tile" style={tileStyle}>
      <span className="tileNumber">{number}</span>
    </div>
  );
};

Tile.propTypes = {
  number : React.PropTypes.number.isRequired,
  width : React.PropTypes.number.isRequired,
  height : React.PropTypes.number.isRequired
};

const mapStateToProps = state => {
  return {canvas : state.app.get('canvas')};
};

const mapDispatchToProps = (dispatch) => {
  return {dispatch : dispatch};
};

export default connect(null, mapDispatchToProps)(Tile);