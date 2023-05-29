import { Provider } from 'react-redux';

import Container from './Container';
import WithLocalData from './WithLocalData';
import { createStore } from './data/store';

const store = createStore();

const App = () => (
  <Provider store={store}>
    <WithLocalData>
      <Container />
    </WithLocalData>
  </Provider>
);

export default App;
