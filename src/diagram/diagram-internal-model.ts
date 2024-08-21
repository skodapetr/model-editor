
export type NodeData = {

  label: string;

  iri: string;

  items: EntityItem[];

}

export interface EntityItem {

  identifier: string;

  label: string;

  domainIdentifier: string;

}

export type EdgeData = {

  waypoints: Waypoint[];

}

export interface Waypoint {

  x: number;

  y: number;

}
