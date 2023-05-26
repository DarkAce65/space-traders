import Spinner from './Spinner';
import useAgent from './hooks/useAgent';

const Home = () => {
  const { status, data: agent } = useAgent();

  if (status === 'LOADING') {
    return <Spinner />;
  } else if (status === 'FAILED') {
    return <div>ERROR</div>;
  }

  return <div>Welcome, {agent.agentName}</div>;
};

export default Home;
