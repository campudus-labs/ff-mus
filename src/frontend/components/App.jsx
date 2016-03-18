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
        <Canvas x={canvas.get("x")}
                y={canvas.get("y")}
                width={canvas.get("width")}
                height={canvas.get("height")}
                users={canvas.get("users")}
                tiles={canvas.get("tiles")}/>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {canvas : state.app.get('canvas')};
};

export default connect(mapStateToProps)(App);
