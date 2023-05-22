import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { external } from '@/schema';

import pick from './pick';
import { scanSystems, scanWaypoints } from '../actions';
import { client, unwrapDataOrThrow } from '../client';
import { pagedFetchAll } from '../pagedFetchAll';
import { getAuthToken } from '../selectors';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../storeUtils';

type System = external['../models/System.json'];
type Waypoint = external['../models/Waypoint.json'];
type DehydratedSystem = Pick<System, 'symbol' | 'sectorSymbol' | 'type' | 'x' | 'y'>;
type DehydratedWaypoint = Pick<Waypoint, 'symbol' | 'systemSymbol' | 'type' | 'x' | 'y'>;

export interface UniverseState {
  systems: {
    [systemSymbol: string]:
      | { isHydrated: true; data: System }
      | { isHydrated: false; data: DehydratedSystem };
  };
  waypoints: {
    [waypointSymbol: string]:
      | { isHydrated: true; data: Waypoint }
      | { isHydrated: false; data: DehydratedWaypoint };
  };
}

const getSystems = (state: RootState) => state.universe.systems;

const getWaypoints = (state: RootState) => state.universe.waypoints;

export const fetchSystem = createAppAsyncThunk(
  'universe/fetchSystem',
  async (systemSymbol: string, { getState }) => {
    const token = getAuthToken(getState())!;
    const response = await client.get('/systems/{systemSymbol}', {
      headers: { Authorization: `Bearer ${token}` },
      params: { path: { systemSymbol } },
    });
    return unwrapDataOrThrow(response);
  },
  {
    condition: (systemSymbol, { getState }) => {
      const state = getState();
      return (
        getAuthToken(state) !== null &&
        !Object.prototype.hasOwnProperty.call(getSystems(state), systemSymbol)
      );
    },
  }
);

export const fetchWaypoint = createAppAsyncThunk(
  'universe/fetchWaypoint',
  async (
    { systemSymbol, waypointSymbol }: { systemSymbol: string; waypointSymbol: string },
    { getState }
  ) => {
    const token = getAuthToken(getState())!;
    const response = await client.get('/systems/{systemSymbol}/waypoints/{waypointSymbol}', {
      headers: { Authorization: `Bearer ${token}` },
      params: { path: { systemSymbol, waypointSymbol } },
    });
    return unwrapDataOrThrow(response);
  },
  {
    condition: ({ waypointSymbol }, { getState }) =>
      getAuthToken(getState()) !== null &&
      !Object.prototype.hasOwnProperty.call(getWaypoints(getState()), waypointSymbol),
  }
);

export const fetchSystemWaypoints = createAppAsyncThunk(
  'universe/fetchSystemWaypoints',
  (systemSymbol: string, { getState }) => {
    const token = getAuthToken(getState())!;
    return pagedFetchAll(
      (page, limit) =>
        client
          .get('/systems/{systemSymbol}/waypoints', {
            headers: { Authorization: `Bearer ${token}` },
            params: { path: { systemSymbol }, query: { page, limit } },
          })
          .then(unwrapDataOrThrow)
          .then((response) => ({ data: response.data, total: response.meta.total })),
      20
    );
  },
  {
    condition: (systemSymbol, { getState }) => {
      const state = getState();
      const systemsBySymbol = getSystems(state);
      return (
        (getAuthToken(state) !== null &&
          !Object.prototype.hasOwnProperty.call(systemsBySymbol, systemSymbol)) ||
        !systemsBySymbol[systemSymbol].isHydrated
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
        state.systems[system.symbol] = { isHydrated: true, data: system };

        for (const waypoint of system.waypoints) {
          if (!Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol)) {
            state.waypoints[waypoint.symbol] = {
              isHydrated: false,
              data: { systemSymbol: system.symbol, ...waypoint },
            };
          }
        }
      })
      .addCase(scanSystems.fulfilled, (state, action) => {
        const scannedSystems = action.payload.data.systems;
        for (const system of scannedSystems) {
          if (!Object.prototype.hasOwnProperty.call(state.systems, system.symbol)) {
            state.systems[system.symbol] = {
              isHydrated: false,
              data: pick(system, ['symbol', 'sectorSymbol', 'type', 'x', 'y']),
            };
          }
        }
      })
      .addMatcher(
        isAnyOf(fetchWaypoint.fulfilled, fetchSystemWaypoints.fulfilled, scanWaypoints.fulfilled),
        (state, action) => {
          let waypoints: Waypoint[];
          if (fetchWaypoint.fulfilled.match(action)) {
            waypoints = [action.payload.data];
          } else if (fetchSystemWaypoints.fulfilled.match(action)) {
            waypoints = action.payload.data;
          } else if (scanWaypoints.fulfilled.match(action)) {
            waypoints = action.payload.data.waypoints;
          } else {
            throw new Error('Unexpected action handled');
          }

          for (const waypoint of waypoints) {
            if (
              !Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol) ||
              !state.waypoints[waypoint.symbol].isHydrated
            ) {
              state.waypoints[waypoint.symbol] = { isHydrated: true, data: waypoint };
            }
          }
        }
      );
  },
});

export default universeSlice.reducer;
