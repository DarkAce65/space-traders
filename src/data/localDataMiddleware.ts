import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { scanSystems, scanWaypoints } from './actions';
import { persistSystems, persistWaypoints } from './localDb';
import {
  fetchSystem,
  fetchSystemWaypoints,
  fetchWaypoint,
  getSystems,
  getWaypoints,
} from './slices/universeSlice';
import { RootState } from './store';
import assertUnreachable from '../utils/assertUnreachable';

const localDataMiddleware = createListenerMiddleware<RootState>();

const systemMatcher = isAnyOf(fetchSystem.fulfilled, scanSystems.fulfilled);
localDataMiddleware.startListening({
  matcher: systemMatcher,
  effect: async (action, { getState }) => {
    let updatedSystemSymbols: string[];
    if (fetchSystem.fulfilled.match(action)) {
      updatedSystemSymbols = [action.payload.data.symbol];
    } else if (scanSystems.fulfilled.match(action)) {
      updatedSystemSymbols = action.payload.data.systems.map((system) => system.symbol);
    } else {
      throw assertUnreachable(action);
    }

    const systems = getSystems(getState());
    await persistSystems(updatedSystemSymbols.map((systemSymbol) => systems[systemSymbol].data));
  },
});

const waypointMatcher = isAnyOf(
  fetchSystem.fulfilled,
  fetchWaypoint.fulfilled,
  fetchSystemWaypoints.fulfilled,
  scanWaypoints.fulfilled
);
localDataMiddleware.startListening({
  matcher: waypointMatcher,
  effect: async (action, { getState }) => {
    let updatedWaypointSymbols: string[];
    if (fetchSystem.fulfilled.match(action)) {
      updatedWaypointSymbols = action.payload.data.waypoints.map((waypoint) => waypoint.symbol);
    } else if (fetchWaypoint.fulfilled.match(action)) {
      updatedWaypointSymbols = [action.payload.data.symbol];
    } else if (fetchSystemWaypoints.fulfilled.match(action)) {
      updatedWaypointSymbols = action.payload.data.map((waypoint) => waypoint.symbol);
    } else if (scanWaypoints.fulfilled.match(action)) {
      updatedWaypointSymbols = action.payload.data.waypoints.map((waypoint) => waypoint.symbol);
    } else {
      throw assertUnreachable(action);
    }

    const waypoints = getWaypoints(getState());
    await persistWaypoints(
      updatedWaypointSymbols.map((waypointSymbol) => waypoints[waypointSymbol].data)
    );
  },
});

export default localDataMiddleware.middleware;
