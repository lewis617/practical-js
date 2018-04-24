import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.html';

class C1 extends Component {
  render() {
    return (
      <div>
        This is c1
      </div>
    );
  }
}

render(<C1 />, document.querySelector('#app'));

