import { external } from '@/schema';

export type Subset<T, U extends T> = Extract<T, U>;

export type LoadStatus = 'UNINITIALIZED' | 'PENDING' | 'SUCCEEDED' | 'FAILED';

export type DataHookResponse<T> = (
  | { status: 'LOADING'; data: null }
  | { status: 'FAILED'; data: null }
  | { status: 'READY'; data: T }
) & { refetch: () => void };

export interface Agent {
  accountId: string;
  agentName: string;
  headquarters: string;
  credits: number;
}

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
