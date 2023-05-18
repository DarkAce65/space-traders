import { createSlice } from '@reduxjs/toolkit';

import { external } from '@/schema';

import { client, unwrapDataOrThrow } from '../../client';
import { scanSystems, scanWaypoints } from '../actions';
import { pagedFetchAll } from '../pagedFetchAll';
import { getAuthToken } from '../selectors';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../storeUtils';

type UnexploredSystem = external['../models/ScannedSystem.json'];
type UnexploredWaypoint = external['../models/SystemWaypoint.json'];
type System = external['../models/System.json'];
type Waypoint = external['../models/Waypoint.json'];

export interface UniverseState {
  systems: {
    [systemSymbol: string]:
      | { isExplored: true; data: System }
      | { isExplored: false; data: UnexploredSystem };
  };
  waypoints: {
    [waypointSymbol: string]:
      | { isExplored: true; data: Waypoint }
      | { isExplored: false; data: UnexploredWaypoint };
  };
}

const getSystems = (state: RootState) => state.universe.systems;

const getWaypoints = (state: RootState) => state.universe.waypoints;

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

export const fetchWaypoint = createAppAsyncThunk(
  'universe/fetchWaypoint',
  async (
    { systemSymbol, waypointSymbol }: { systemSymbol: string; waypointSymbol: string },
    { getState }
  ) => {
    const token = getAuthToken(getState());
    const response = await client.get('/systems/{systemSymbol}/waypoints/{waypointSymbol}', {
      headers: { Authorization: `Bearer ${token}` },
      params: { path: { systemSymbol, waypointSymbol } },
    });
    return unwrapDataOrThrow(response);
  },
  {
    condition: ({ waypointSymbol }, { getState }) =>
      !Object.prototype.hasOwnProperty.call(getWaypoints(getState()), waypointSymbol),
  }
);

export const fetchSystemWaypoints = createAppAsyncThunk(
  'universe/fetchSystemWaypoints',
  (systemSymbol: string, { getState }) => {
    const token = getAuthToken(getState());
    return pagedFetchAll(
      (page, limit) =>
        client
          .get('/systems/{systemSymbol}/waypoints', {
            headers: { Authorization: `Bearer ${token}` },
            params: { path: { systemSymbol }, query: { limit, page } },
          })
          .then(unwrapDataOrThrow)
          .then((response) => ({ data: response.data, total: response.meta.total })),
      20
    );
  },
  {
    condition: (systemSymbol, { getState }) => {
      const systemsBySymbol = getSystems(getState());
      return (
        !Object.prototype.hasOwnProperty.call(systemsBySymbol, systemSymbol) ||
        !systemsBySymbol[systemSymbol].isExplored
      );
    },
  }
);

const initialState: UniverseState = { systems: {}, waypoints: {} };

const universeSlice = createSlice({
  name: 'universe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystem.fulfilled, (state, action) => {
        const system = action.payload.data;
        state.systems[system.symbol] = { isExplored: true, data: system };

        for (const waypoint of system.waypoints) {
          if (!Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol)) {
            state.waypoints[waypoint.symbol] = { isExplored: false, data: waypoint };
          }
        }
      })
      .addCase(fetchWaypoint.fulfilled, (state, action) => {
        const waypoint = action.payload.data;
        if (
          !Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol) ||
          !state.waypoints[waypoint.symbol].isExplored
        ) {
          state.waypoints[waypoint.symbol] = { isExplored: true, data: waypoint };
        }
      })
      .addCase(fetchSystemWaypoints.fulfilled, (state, action) => {
        const waypoints = action.payload.data;
        for (const waypoint of waypoints) {
          if (
            !Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol) ||
            !state.waypoints[waypoint.symbol].isExplored
          ) {
            state.waypoints[waypoint.symbol] = { isExplored: true, data: waypoint };
          }
        }
      })
      .addCase(scanSystems.fulfilled, (state, action) => {
        const scannedSystems = action.payload.data.systems;
        for (const system of scannedSystems) {
          if (!Object.prototype.hasOwnProperty.call(state.systems, system.symbol)) {
            state.systems[system.symbol] = { isExplored: false, data: system };
          }
        }
      })
      .addCase(scanWaypoints.fulfilled, (state, action) => {
        const scannedWaypoints = action.payload.data.waypoints;
        for (const waypoint of scannedWaypoints) {
          if (
            !Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol) ||
            !state.waypoints[waypoint.symbol].isExplored
          ) {
            state.waypoints[waypoint.symbol] = { isExplored: true, data: waypoint };
          }
        }
      });
  },
});

export default universeSlice.reducer;
