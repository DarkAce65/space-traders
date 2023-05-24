import { external } from '@/schema';

export type LoadStatus = 'UNINITIALIZED' | 'PENDING' | 'SUCCEEDED' | 'FAILED';

export type DehydratedSystem = Pick<
  external['../models/System.json'],
  'symbol' | 'sectorSymbol' | 'type' | 'x' | 'y'
>;
export type DehydratedWaypoint = Pick<
  external['../models/Waypoint.json'],
  'symbol' | 'systemSymbol' | 'type' | 'x' | 'y'
>;
export type System = DehydratedSystem & {
  waypoints: string[];
  factions: string[];
};
export type Waypoint = DehydratedWaypoint & {
  orbitals: string[];
  faction: string | null;
  traits: external['../models/WaypointTrait.json'][];
  chart: external['../models/Chart.json'] | null;
};

export const isHydratedSystem = (system: System | DehydratedSystem): system is System =>
  'waypoints' in system && 'factions' in system;

export const isHydratedWaypoint = (waypoint: Waypoint | DehydratedWaypoint): waypoint is Waypoint =>
  'orbitals' in waypoint && 'faction' in waypoint && 'traits' in waypoint && 'chart' in waypoint;

export const mapSystemFromResponse = (system: external['../models/System.json']): System => ({
  ...system,
  waypoints: system.waypoints.map((waypoint) => waypoint.symbol),
  factions: system.factions.map((faction) => faction.symbol),
});

export const mapWaypointFromResponse = (
  waypoint: external['../models/Waypoint.json']
): Waypoint => ({
  ...waypoint,
  orbitals: waypoint.orbitals.map((orbital) => orbital.symbol),
  faction: waypoint.faction ? waypoint.faction.symbol : null,
  chart: waypoint.chart || null,
});
