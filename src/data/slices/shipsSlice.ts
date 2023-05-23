import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { external } from '@/schema';

import { scanShips, scanSystems, scanWaypoints } from '../actions';
import { client, unwrapDataOrThrow } from '../client';
import { pagedFetchAll } from '../pagedFetchAll';
import { getAuthHeaderOrThrow } from '../selectors';
import { createAppAsyncThunk } from '../storeUtils';

type Ship = external['../models/Ship.json'];

export interface ShipsState {
  ships: { [shipSymbol: string]: Ship };
  cooldowns: {
    [shipSymbol: string]: {
      total: number;
      expirationTimestamp: number;
    };
  };
}

export const fetchAllShips = createAppAsyncThunk('ships/fetchAllShips', async (_, { getState }) => {
  const headers = getAuthHeaderOrThrow(getState());
  return pagedFetchAll(
    (page, limit) =>
      client
        .get('/my/ships', { headers, params: { query: { page, limit } } })
        .then(unwrapDataOrThrow)
        .then((response) => ({ data: response.data, total: response.meta.total })),
    20
  );
});

export const fetchShipCooldown = createAppAsyncThunk(
  'ships/fetchShipCooldown',
  async (shipSymbol: string, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    return client
      .get('/my/ships/{shipSymbol}/cooldown', { headers, params: { path: { shipSymbol } } })
      .then((response) => {
        if (response.response.status === 204) {
          return null;
        }
        return unwrapDataOrThrow(response);
      });
  }
);

const initialState: ShipsState = { ships: {}, cooldowns: {} };

const shipsSlice = createSlice({
  name: 'ships',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShips.fulfilled, (state, action) => {
        const ships = action.payload.data;
        for (const ship of ships) {
          state.ships[ship.symbol] = ship;
        }
      })
      .addCase(fetchShipCooldown.fulfilled, (state, action) => {
        const shipSymbol = action.meta.arg;
        if (action.payload === null || !action.payload.data.expiration) {
          if (Object.prototype.hasOwnProperty.call(state.cooldowns, shipSymbol)) {
            delete state.cooldowns[shipSymbol];
          }
        } else {
          const { totalSeconds, expiration } = action.payload.data;
          state.cooldowns[shipSymbol] = {
            total: totalSeconds,
            expirationTimestamp: new Date(expiration).getTime(),
          };
        }
      })
      .addMatcher(
        isAnyOf(scanSystems.fulfilled, scanWaypoints.fulfilled, scanShips.fulfilled),
        (state, action) => {
          const { shipSymbol, totalSeconds, expiration } = action.payload.data.cooldown;
          state.cooldowns[shipSymbol] = {
            total: totalSeconds,
            expirationTimestamp: new Date(expiration!).getTime(),
          };
        }
      );
  },
});

export default shipsSlice.reducer;
