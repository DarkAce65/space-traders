import Home from './Home';
import LoginModal from './LoginModal';
import { getAuthToken } from './data/selectors';
import { useAppSelector } from './data/storeUtils';

const Container = () => {
  const token = useAppSelector(getAuthToken);

  return (
    <>
      <LoginModal open={!token} />
      <Home />
    </>
  );
};

export default Container;
