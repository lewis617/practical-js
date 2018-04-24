import React, { Component } from 'react';
import { render } from 'react-dom';
import './c2.html';

class C2 extends Component {
  state = {}
  render() {
    const { ...rest } = { a: 1 };
    return (
      <div>
        This is c2
      </div>
    );
  }
}

render(<C2 />, document.querySelector('#app'));

