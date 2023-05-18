import { Provider } from 'react-redux';

import Test from './Test';
import { createStore } from './data/store';

const store = createStore();

const App = () => (
  <Provider store={store}>
    <Test />
  </Provider>
);

export default App;
