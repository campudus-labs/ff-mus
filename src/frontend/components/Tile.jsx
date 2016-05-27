import React from 'react';
import { Motion, spring, presets } from 'react-motion';
import './tile.scss';
import _ from 'lodash';

const Tile = (props) => {
  const {number, width, height, color, onClick} = props;
  const backgroundColor = _.isNil(color) ? 'transparent' : color;

  const styleObj = {width : width, height : height};

  const fillColorAnimation = {
    op : spring(!_.isNil(color) ? 1 : 0, {stiffness : 170, damping : 5, precision: 0.001}),
    width : spring(!_.isNil(color) ? 100 : 0, {stiffness : 170, damping : 5, precision: 0.001}),
    height : spring(!_.isNil(color) ? 100 : 0, {stiffness : 170, damping : 5, precision: 0.001})
  };

  return (
    <Motion
      style={fillColorAnimation}
    >
      { style => {
        return (
          <div onClick={onClick.bind(this, number)} className="tile"
               style={styleObj}>
            <span className="tileNumber">{number}</span>
            <span className="backgroundColor"
                  style={
                   { opacity: style.op,
                     width: style.width+'%',
                     height: style.height+'%',
                     borderRadius: 100+'px',
                     backgroundColor: backgroundColor
                  }}/>
          </div>)
      }}</Motion>
  );
};

Tile.propTypes = {
  number : React.PropTypes.number.isRequired,
  width : React.PropTypes.number.isRequired,
  height : React.PropTypes.number.isRequired,
  onClick : React.PropTypes.func.isRequired
};

export default Tile;