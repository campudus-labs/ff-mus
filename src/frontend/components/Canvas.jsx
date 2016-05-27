import React from 'react';
import './canvas.scss';
import Tile from './Tile.jsx';
import User from './User.jsx';
import { connect } from 'react-redux';
import _ from 'lodash';
import { userClick } from '../actions/actionCreators';

const Canvas = (props) => {
  console.log('Canvas with Props: ', props);
  const {width, height, tiles, users, dispatch} = props;

  //Action SetTile dimensions
  const canvasStyle = {
    width : width + "px",
    height : height + "px"
  };

  let calculatedTileWidth = width / tiles[0].length;
  let calculatedTileHeight = height / tiles.length;

  const onTileClick = (number, event) => {
    event.preventDefault();
    const myUserId = users.myUserId;
    
    const currentColor = users.entities[`${users.myUserId}`]['color'];
    props.dispatch(userClick(number, currentColor));
  };

  const renderUsers = () => {
    const userEntities = users.entities;

    return _.map(userEntities, (user) => {
      return <User key={user.id}
                   id={user.id}
                   name={user.name}
                   color={user.color}/>;
    });
  };

  const renderTiles = () => {
    return tiles.map((row) => {
      return row.map((tile)=> {
        return <Tile key={tile.number}
                     number={tile.number}
                     width={calculatedTileWidth}
                     height={calculatedTileHeight}
                     color={tile.color}
                     onClick={onTileClick}
        />;
      })
    })
  };

  return (
    <div id="canvas" style={canvasStyle}>
      <div id="tiles">
        {renderTiles()}
      </div>
      <div id="users">
        {renderUsers()}
      </div>
    </div>
  );
};

Canvas.propTypes = {
  width : React.PropTypes.number.isRequired,
  height : React.PropTypes.number.isRequired,
  users : React.PropTypes.object,
  tiles : React.PropTypes.array
};

export default connect(state => {
  return {canvas : state.app.canvas};
})(Canvas);