import { createSlice } from '@reduxjs/toolkit';

import { external } from '@/schema';

import { client, unwrapDataOrThrow } from '../../client';
import { getAuthToken } from '../selectors';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../storeUtils';

type System = external['../models/System.json'];
type SystemWaypoint = external['../models/SystemWaypoint.json'];
type Waypoint = external['../models/Waypoint.json'];

export interface UniverseState {
  systems: { [systemSymbol: string]: System };
  waypoints: { [waypointSymbol: string]: SystemWaypoint | Waypoint };
}

const getSystems = (state: RootState) => state.universe.systems;

export const fetchSystem = createAppAsyncThunk(
  'universe/fetchSystem',
  async (systemSymbol: string, { getState }) => {
    const token = getAuthToken(getState());
    const response = await client.get('/systems/{systemSymbol}', {
      headers: { Authorization: `Bearer ${token}` },
      params: { path: { systemSymbol } },
    });
    return unwrapDataOrThrow(response);
  },
  {
    condition: (systemSymbol, { getState }) =>
      !Object.prototype.hasOwnProperty.call(getSystems(getState()), systemSymbol),
  }
);

const initialState: UniverseState = { systems: {}, waypoints: {} };

const universeSlice = createSlice({
  name: 'universe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSystem.fulfilled, (state, action) => {
      const system = action.payload.data;
      state.systems[system.symbol] = system;

      for (const waypoint of system.waypoints) {
        state.waypoints[waypoint.symbol] = waypoint;
      }
    });
  },
});

export default universeSlice.reducer;
