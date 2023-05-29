import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { external } from '@/schema';

import {
  DehydratedSystem,
  DehydratedWaypoint,
  LoadStatus,
  Subset,
  System,
  Waypoint,
} from '../../types';
import assertUnreachable from '../../utils/assertUnreachable';
import pick from '../../utils/pick';
import { loadLocalData, scanSystems, scanWaypoints } from '../actions';
import { client, unwrapDataOrThrow } from '../client';
import { pagedFetchAll } from '../pagedFetchAll';
import { getAuthHeaderOrThrow } from '../selectors';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../storeUtils';

export const isHydratedSystem = (system: System | DehydratedSystem): system is System =>
  'waypoints' in system && 'factions' in system;

export const isHydratedWaypoint = (waypoint: Waypoint | DehydratedWaypoint): waypoint is Waypoint =>
  'orbitals' in waypoint && 'faction' in waypoint && 'traits' in waypoint && 'chart' in waypoint;

const mapSystemFromResponse = (system: external['../models/System.json']): System => ({
  ...system,
  waypoints: system.waypoints.map((waypoint) => waypoint.symbol),
  factions: system.factions.map((faction) => faction.symbol),
});

const mapWaypointFromResponse = (waypoint: external['../models/Waypoint.json']): Waypoint => ({
  ...waypoint,
  orbitals: waypoint.orbitals.map((orbital) => orbital.symbol),
  faction: waypoint.faction ? waypoint.faction.symbol : null,
  chart: waypoint.chart || null,
});

export interface UniverseState {
  systemStatuses: { [systemSymbol: string]: Subset<LoadStatus, 'PENDING' | 'FAILED'> };
  systems: {
    [systemSymbol: string]:
      | { isHydrated: true; data: System }
      | { isHydrated: false; data: DehydratedSystem };
  };
  waypointStatuses: { [waypointSymbol: string]: Subset<LoadStatus, 'PENDING' | 'FAILED'> };
  waypoints: {
    [waypointSymbol: string]:
      | { isHydrated: true; data: Waypoint }
      | { isHydrated: false; data: DehydratedWaypoint };
  };
}

const isSystemBeingFetched = (state: RootState, systemSymbol: string) =>
  state.universe.systemStatuses[systemSymbol] &&
  state.universe.systemStatuses[systemSymbol] === 'PENDING';

export const getSystems = (state: RootState) => state.universe.systems;

const isWaypointBeingFetched = (state: RootState, waypointSymbol: string) =>
  state.universe.waypointStatuses[waypointSymbol] &&
  state.universe.waypointStatuses[waypointSymbol] === 'PENDING';

export const getWaypoints = (state: RootState) => state.universe.waypoints;

export const fetchSystem = createAppAsyncThunk(
  'universe/fetchSystem',
  async (systemSymbol: string, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    const response = await client.get('/systems/{systemSymbol}', {
      headers,
      params: { path: { systemSymbol } },
    });
    return unwrapDataOrThrow(response);
  },
  {
    condition: (systemSymbol, { getState }) => {
      const state = getState();
      const systems = getSystems(state);
      return (
        !isSystemBeingFetched(state, systemSymbol) &&
        (!Object.prototype.hasOwnProperty.call(systems, systemSymbol) ||
          !systems[systemSymbol].isHydrated)
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
    const headers = getAuthHeaderOrThrow(getState());
    const response = await client.get('/systems/{systemSymbol}/waypoints/{waypointSymbol}', {
      headers,
      params: { path: { systemSymbol, waypointSymbol } },
    });
    return unwrapDataOrThrow(response);
  },
  {
    condition: ({ waypointSymbol }, { getState }) => {
      const state = getState();
      const waypoints = getWaypoints(state);
      return (
        (!isWaypointBeingFetched(state, waypointSymbol) &&
          !Object.prototype.hasOwnProperty.call(waypoints, waypointSymbol)) ||
        !waypoints[waypointSymbol].isHydrated
      );
    },
  }
);

export const fetchSystemWaypoints = createAppAsyncThunk(
  'universe/fetchSystemWaypoints',
  (systemSymbol: string, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    return pagedFetchAll(
      (page, limit) =>
        client
          .get('/systems/{systemSymbol}/waypoints', {
            headers,
            params: { path: { systemSymbol }, query: { page, limit } },
          })
          .then(unwrapDataOrThrow)
          .then((response) => ({ data: response.data, total: response.meta.total })),
      20
    );
  }
);

const initialState: UniverseState = {
  systemStatuses: {},
  systems: {},
  waypointStatuses: {},
  waypoints: {},
};

const universeSlice = createSlice({
  name: 'universe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalData.fulfilled, (state, action) => {
        const { systems, waypoints } = action.payload;
        for (const system of systems) {
          if (isHydratedSystem(system)) {
            state.systems[system.symbol] = { isHydrated: true, data: system };
          } else {
            state.systems[system.symbol] = { isHydrated: false, data: system };
          }
        }
        for (const waypoint of waypoints) {
          if (isHydratedWaypoint(waypoint)) {
            state.waypoints[waypoint.symbol] = { isHydrated: true, data: waypoint };
          } else {
            state.waypoints[waypoint.symbol] = { isHydrated: false, data: waypoint };
          }
        }
      })
      .addCase(fetchSystem.pending, (state, action) => {
        state.systemStatuses[action.meta.arg] = 'PENDING';
      })
      .addCase(fetchSystem.fulfilled, (state, action) => {
        const system = action.payload.data;
        delete state.systemStatuses[action.meta.arg];
        state.systems[system.symbol] = { isHydrated: true, data: mapSystemFromResponse(system) };

        for (const waypoint of system.waypoints) {
          if (!Object.prototype.hasOwnProperty.call(state.waypoints, waypoint.symbol)) {
            state.waypoints[waypoint.symbol] = {
              isHydrated: false,
              data: { systemSymbol: system.symbol, ...waypoint },
            };
          }
        }
      })
      .addCase(fetchSystem.rejected, (state, action) => {
        state.systemStatuses[action.meta.arg] = 'FAILED';
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
      .addCase(fetchWaypoint.pending, (state, action) => {
        state.waypointStatuses[action.meta.arg.waypointSymbol] = 'PENDING';
      })
      .addCase(fetchWaypoint.rejected, (state, action) => {
        delete state.waypointStatuses[action.meta.arg.waypointSymbol];
      })
      .addMatcher(
        isAnyOf(fetchWaypoint.fulfilled, fetchSystemWaypoints.fulfilled, scanWaypoints.fulfilled),
        (state, action) => {
          let waypoints: Waypoint[];
          if (fetchWaypoint.fulfilled.match(action)) {
            waypoints = [mapWaypointFromResponse(action.payload.data)];
            state.waypointStatuses[action.meta.arg.waypointSymbol] = 'FAILED';
          } else if (fetchSystemWaypoints.fulfilled.match(action)) {
            waypoints = action.payload.data.map((waypoint) => mapWaypointFromResponse(waypoint));
          } else if (scanWaypoints.fulfilled.match(action)) {
            waypoints = action.payload.data.waypoints.map((waypoint) =>
              mapWaypointFromResponse(waypoint)
            );
          } else {
            throw assertUnreachable(action);
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
