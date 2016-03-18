import React from 'react';
import {List} from 'immutable';
import './canvas.scss';
import Tile from './Tile.jsx';
import User from './User.jsx';

const Canvas = (props) => {
  console.log('Canvas with Props: ', props);
  const {width,height,tiles, users} = props;
  //Action SetTile dimensions
  const canvasStyle = {
    width : width + "px",
    height : height + "px"
  };

  let calculatedTileWidth = width / tiles.get(0).count();
  let calculatedTileHeight = height / tiles.count();

  const renderUsers = () => {
    return users.map((user) => {
      return <User key={user.get('id')}
                    id={user.get('id')}
                    name={user.get('name')}
                    color={user.get('color')}/>;
    })
  };

  const renderTiles = () => {
    return tiles.map((row) => {
      return row.map((tile)=> {
        return <Tile key={tile.get('number')}
                     number={tile.get('number')}
                     width={calculatedTileWidth}
                     height={calculatedTileHeight}/>;
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
  tiles : React.PropTypes.instanceOf(List)
};

export default Canvas;