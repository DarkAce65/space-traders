import { Provider } from 'react-redux';

import { createStore } from './data/store';

const store = createStore();

const App = () => <Provider store={store}></Provider>;

export default App;
