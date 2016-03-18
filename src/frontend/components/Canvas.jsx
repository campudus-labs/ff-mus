import React from 'react';
import {List} from 'immutable';
import './canvas.scss';
import Tile from './Tile.jsx';
import User from './User.jsx';
import { connect } from 'react-redux';

import {userClick} from "../actions/actionCreators";

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

  const onTileClick = (number, event) => {
    event.preventDefault();
    const currentColor = users.getIn(['entities', users.get('myUserId').toString(), "color"]);
    props.dispatch(userClick(number, currentColor));
  };

  const renderUsers = () => {
    return users.get('entities').map((user) => {
      return <User key={user.get('id')}
                   id={user.get('id')}
                   name={user.get('name')}
                   color={user.get('color')}/>;
    }).toList();
  };

  const renderTiles = () => {
    return tiles.map((row) => {
      return row.map((tile)=> {
        return <Tile key={tile.get('number')}
                     number={tile.get('number')}
                     width={calculatedTileWidth}
                     height={calculatedTileHeight}
                     color={tile.get('color')}
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
  tiles : React.PropTypes.instanceOf(List)
};

const mapStateToProps = state => {
  return {canvas : state.app.get('canvas')};
};

const mapDispatchToProps = (dispatch) => {
  return {dispatch : dispatch};
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);