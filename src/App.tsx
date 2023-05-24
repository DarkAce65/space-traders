import { Provider } from 'react-redux';

import Container from './Container';
import { createStore } from './data/store';

const store = createStore();

const App = () => (
  <Provider store={store}>
    <Container />
  </Provider>
);

export default App;
