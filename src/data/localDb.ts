import localforage from 'localforage';

import { DehydratedSystem, DehydratedWaypoint, System, Waypoint } from '../types';
import { isObjectWithExactKeys } from '../utils/isObjectWithKeys';

const verifySystem = (system: unknown): system is PersistedSystem =>
  isObjectWithExactKeys(system, [
    'symbol',
    'sectorSymbol',
    'type',
    'x',
    'y',
    'waypoints',
    'factions',
  ]) || isObjectWithExactKeys(system, ['symbol', 'sectorSymbol', 'type', 'x', 'y']);

const verifyWaypoint = (waypoint: unknown): waypoint is PersistedWaypoint =>
  isObjectWithExactKeys(waypoint, [
    'symbol',
    'type',
    'systemSymbol',
    'x',
    'y',
    'orbitals',
    'faction',
    'traits',
    'chart',
  ]) || isObjectWithExactKeys(waypoint, ['symbol', 'systemSymbol', 'type', 'x', 'y']);

const systemsDb = localforage.createInstance({
  name: 'space-traders',
  storeName: 'systems',
});
const waypointsDb = localforage.createInstance({
  name: 'space-traders',
  storeName: 'waypoints',
});

type PersistedSystem = System | DehydratedSystem;
type PersistedWaypoint = Waypoint | DehydratedWaypoint;

const iterateSystems = systemsDb.iterate.bind(systemsDb)<PersistedSystem, void>;
const writeSystem = systemsDb.setItem.bind(systemsDb)<PersistedSystem>;
const iterateWaypoints = waypointsDb.iterate.bind(waypointsDb)<PersistedWaypoint, void>;
const writeWaypoint = waypointsDb.setItem.bind(waypointsDb)<PersistedWaypoint>;

export const persistSystems = async (systems: PersistedSystem[]) => {
  await Promise.all(systems.map((system) => writeSystem(system.symbol, system)));
};

export const persistWaypoints = async (waypoints: PersistedWaypoint[]) => {
  await Promise.all(waypoints.map((waypoint) => writeWaypoint(waypoint.symbol, waypoint)));
};

export const readSystemsAndWaypoints = async (): Promise<{
  systems: PersistedSystem[];
  waypoints: PersistedWaypoint[];
}> => {
  const systems: PersistedSystem[] = [];
  const waypoints: PersistedWaypoint[] = [];

  await Promise.all([
    iterateSystems((system) => {
      if (verifySystem(system)) {
        systems.push(system);
      }
    }),
    iterateWaypoints((waypoint) => {
      if (verifyWaypoint(waypoint)) {
        waypoints.push(waypoint);
      }
    }),
  ]);

  return { systems, waypoints };
};
