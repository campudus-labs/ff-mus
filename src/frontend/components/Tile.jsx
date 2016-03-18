import React from 'react';
import "./tile.scss";


const Tile = (props) => {
  const {number, width, height, color, onClick} = props;

  const tileStyle = {
    width : width + "px",
    height : height + "px",
    backgroundColor : color
  };

  return (
    <div onClick={onClick.bind(this, number)} className="tile" style={tileStyle}>
      <span className="tileNumber">{number}</span>
    </div>
  );
};

Tile.propTypes = {
  number : React.PropTypes.number.isRequired,
  width : React.PropTypes.number.isRequired,
  height : React.PropTypes.number.isRequired,
  onClick : React.PropTypes.func.isRequired
};

export default Tile;