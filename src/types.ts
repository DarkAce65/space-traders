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
