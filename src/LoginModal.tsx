import clsx from 'clsx';
import { useMemo, useState } from 'react';

import { RegisterAgentArgs, registerAgent } from './data/actions';
import { loadToken } from './data/slices/authSlice';
import { useAppDispatch } from './data/storeUtils';

const JWT_REGEX = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)$/;

const LoadTokenForm = () => {
  const dispatch = useAppDispatch();

  const [token, setToken] = useState('');
  const tokenIsValid = useMemo(() => token && JWT_REGEX.test(token), [token]);

  return (
    <>
      <div className="form-control">
        <label className="label">Token</label>
        <input
          type="text"
          value={token}
          className="input-bordered input w-full"
          onChange={({ target: { value } }) => {
            setToken(value);
          }}
        />
        {token && !tokenIsValid && (
          <label className="label">
            <span className="label-text-alt text-error">Token is invalid</span>
          </label>
        )}
      </div>
      <div className="modal-action">
        <button
          disabled={!token || !tokenIsValid}
          className="btn"
          onClick={() => {
            dispatch(loadToken(token));
          }}
        >
          Load
        </button>
      </div>
    </>
  );
};

const factions: RegisterAgentArgs['faction'][] = [
  'COSMIC',
  'VOID',
  'GALACTIC',
  'QUANTUM',
  'DOMINION',
];
const RegisterAgentForm = () => {
  const dispatch = useAppDispatch();

  const [agentName, setAgentName] = useState('');
  const [faction, setFaction] = useState(factions[0]);
  const [email, setEmail] = useState('');

  return (
    <>
      <div className="form-control">
        <label className="label">Agent name</label>
        <input
          type="text"
          value={agentName}
          className="input-bordered input w-full"
          onChange={({ target: { value } }) => {
            setAgentName(value);
          }}
        />
      </div>
      <div className="form-control">
        <label className="label">Faction</label>
        <select
          className="select-bordered select w-full"
          onChange={({ target: { value } }) => {
            setFaction(value as RegisterAgentArgs['faction']);
          }}
        >
          {factions.map((factionName) => (
            <option key={factionName} value={factionName}>
              {factionName}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label">
          <span>
            Email <span className="text-sm">(Optional, used to recover agent after reset)</span>
          </span>
        </label>
        <input
          type="text"
          value={email}
          className="input-bordered input w-full"
          onChange={({ target: { value } }) => {
            setEmail(value);
          }}
        />
      </div>
      <div className="modal-action">
        <button
          disabled={!agentName || !faction}
          className="btn"
          onClick={() => {
            dispatch(registerAgent({ agentName, faction, email }));
          }}
        >
          Register
        </button>
      </div>
    </>
  );
};

const LoginModal = ({ open }: { open: boolean }) => {
  const [tab, setTab] = useState<'load' | 'register'>('load');

  return (
    <div className={clsx('modal', { 'modal-open': open })}>
      <div className="modal-box mt-24 max-w-3xl" style={{ alignSelf: 'start' }}>
        <h1 className="mb-6 text-center text-4xl">Space Traders</h1>
        <div className="tabs mb-6 w-full">
          <button
            className={clsx('tab-bordered tab tab-lg w-1/2', { 'tab-active': tab === 'load' })}
            onClick={() => {
              setTab('load');
            }}
          >
            Load token
          </button>
          <button
            className={clsx('tab-bordered tab tab-lg w-1/2', {
              'tab-active': tab === 'register',
            })}
            onClick={() => {
              setTab('register');
            }}
          >
            Register new agent
          </button>
        </div>
        {tab === 'load' && <LoadTokenForm />}
        {tab === 'register' && <RegisterAgentForm />}
      </div>
    </div>
  );
};

export default LoginModal;
