import { useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';

import { registerAgent } from './data/actions';
import { fetchAgent } from './data/slices/agentSlice';
import { loadToken } from './data/slices/authSlice';
import { fetchAllShips } from './data/slices/shipsSlice';
import { fetchSystem, fetchSystemWaypoints } from './data/slices/universeSlice';
import { useAppDispatch, useAppSelector } from './data/storeUtils';

const Dark = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: black;
  color: white;
`;

const Test = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  const n = useAppSelector((state) => state.agent.agentName);
  useEffect(() => {
    if (n) {
      setName(n);
    }
  }, [n]);
  const t = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    if (t) {
      setToken(t);
    }
  }, [t]);

  const headquarters = useAppSelector((state) => state.agent.headquarters);
  const headquarterSystem = headquarters ? headquarters.split('-').slice(0, 2).join('-') : '';

  const ships = useAppSelector((state) => state.ships.ships);
  const orderedShips = useMemo(() => {
    const shipSymbols = Object.keys(ships).sort();
    return shipSymbols.map((shipSymbol) => ships[shipSymbol]);
  }, [ships]);

  return (
    <Dark>
      <input
        type="text"
        value={name}
        onChange={({ target: { value } }) => {
          setName(value);
        }}
      />
      <button
        onClick={() => {
          dispatch(registerAgent({ agentName: name, faction: 'COSMIC' }));
        }}
      >
        register
      </button>
      <br />
      <input
        type="text"
        value={token}
        onChange={({ target: { value } }) => {
          setToken(value);
        }}
      />
      <button
        onClick={() => {
          dispatch(loadToken(token));
        }}
      >
        load
      </button>
      <br />
      Headquarters: {headquarters}
      <br />
      Headquarter System: {headquarterSystem}
      <br />
      <button
        onClick={() => {
          dispatch(fetchAgent());
        }}
      >
        fetchAgent
      </button>
      <button
        onClick={() => {
          dispatch(fetchSystem(headquarterSystem));
          dispatch(fetchSystemWaypoints(headquarterSystem));
        }}
      >
        fetchHeadquarterSystem
      </button>
      <br />
      <button
        onClick={() => {
          dispatch(fetchAllShips());
        }}
      >
        fetchShips
      </button>
      <br />
      {orderedShips.map((ship) => (
        <div key={ship.symbol}>
          {ship.symbol} ({ship.registration.role}) - Fuel: {ship.fuel.current} /{' '}
          {ship.fuel.capacity}
        </div>
      ))}
    </Dark>
  );
};

export default Test;
