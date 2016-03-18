import React from 'react';
import ReactDOM from 'react-dom';
import DevTools from './components/devtools';

export default function showDevTools(store) {
  const popup = window.open(null, 'Redux DevTools', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no');
  // Reload in case it already exists
  popup.location.reload();

  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>');
    ReactDOM.render(
      <DevTools store={store}/>,
      popup.document.getElementById('react-devtools-root')
    );
  }, 10);
}
