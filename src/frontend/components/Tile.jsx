import React from 'react';
import "./tile.scss";

const Tile = (props) => {
  const {number, width, height} = props;

  const tileStyle = {
    width : width + "px",
    height : height + "px"
  };

  return (
    <div className="tile" style={tileStyle}>
      <span className="tileNumber">{number}</span>
    </div>
  );
};

Tile.propTypes = {
  number : React.PropTypes.number.isRequired,
  width : React.PropTypes.number.isRequired,
  height : React.PropTypes.number.isRequired
};

export default Tile;