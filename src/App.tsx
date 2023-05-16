import { Store } from '@reduxjs/toolkit';
import { Component, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { RootState, createStore } from './data/store';

class App extends Component {
  private store: Store<RootState>;

  constructor(props: never) {
    super(props);
    this.store = createStore();
  }

  render(): ReactNode {
    return <Provider store={this.store}></Provider>;
  }
}

export default App;
