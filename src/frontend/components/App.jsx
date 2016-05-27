import React from 'react';
import { connect } from 'react-redux';
import Canvas from './Canvas';
import './app.scss';

const App = (props) => {
  const {canvas} = props;
  console.log("canvas prop in App.jsx:", canvas);
  return (
    <div>
      <div>
        <Canvas x={canvas.x}
                y={canvas.y}
                width={canvas.width}
                height={canvas.height}
                users={canvas.users}
                tiles={canvas.tiles}/>
      </div>
    </div>
  );
};

export default connect(state => {
  return {canvas : state.app.canvas};
})(App);
