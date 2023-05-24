import Home from './Home';
import LoginModal from './LoginModal';
import { getAuthToken } from './data/selectors';
import { useAppSelector } from './data/storeUtils';

const Container = () => {
  const token = useAppSelector(getAuthToken);

  if (!token) {
    return <LoginModal />;
  }

  return <Home />;
};

export default Container;
