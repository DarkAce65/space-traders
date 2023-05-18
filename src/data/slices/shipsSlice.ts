import { createSlice } from '@reduxjs/toolkit';

import { external } from '@/schema';

import { client, unwrapDataOrThrow } from '../client';
import { pagedFetchAll } from '../pagedFetchAll';
import { getAuthToken } from '../selectors';
import { createAppAsyncThunk } from '../storeUtils';

type Ship = external['../models/Ship.json'];

export interface ShipsState {
  ships: { [shipSymbol: string]: Ship };
}

export const fetchAllShips = createAppAsyncThunk(
  'ships/fetchAllShips',
  async (_, { getState }) => {
    const token = getAuthToken(getState())!;
    return pagedFetchAll(
      (page, limit) =>
        client
          .get('/my/ships', {
            headers: { Authorization: `Bearer ${token}` },
            params: { query: { page, limit } },
          })
          .then(unwrapDataOrThrow)
          .then((response) => ({ data: response.data, total: response.meta.total })),
      20
    );
  },
  { condition: (_, { getState }) => getAuthToken(getState()) !== null }
);

const initialState: ShipsState = { ships: {} };

const shipsSlice = createSlice({
  name: 'ships',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllShips.fulfilled, (state, action) => {
      const ships = action.payload.data;
      for (const ship of ships) {
        state.ships[ship.symbol] = ship;
      }
    });
  },
});

export default shipsSlice.reducer;
