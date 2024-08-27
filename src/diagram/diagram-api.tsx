/**
 * Allow execution of actions.
 */
export interface DiagramActions {

  getNodes(): Node[];

  addNodes(node: Node[]): void;

  updateNodes(node: Node[]): void;

  removeNodes(identifier: string[]): void;

  getEdges(): Edge[];

  addEdges(edge: Edge[]): void;

  updateEdges(edge: Edge[]): void;

  removeEdges(identifier: string[]): void;

  /**
   * Set content to the diagram.
   * @returns When the diagram is ready.
   */
  setContent(nodes: Node[], edges: Edge[]): Promise<void>;

  setViewToPosition(x: number, y: number): void;

  centerViewToNode(identifier: string): void;

}

/**
 * Entity can be a class or a class profile.
 */
export type Node = {

  identifier: string;

  initialPosition: Position;

  label: string;

  iri: string;

  items: EntityItem[];

}

export interface Position {
  x: number;
  y: number;
}

export interface EntityItem {

  identifier: string;

  label: string;

  domainIdentifier: string;

}

/**
 * Any form of relation that should be rendered as an edge.
 */
export type Edge = {

  identifier: string;

  source: string;

  target: string;

  waypoints: { position: Position }[];

}

/**
 * Callbacks to owner to handle required user actions.
 */
export interface DiagramCallbacks {

  // Node

  onShowNodeDetail: (identifier: string) => void;

  onEditNode: (identifier: string) => void;

  onCreateNodeProfile: (identifier: string) => void;

  onHideNode: (identifier: string) => void;

  onDeleteNode: (identifier: string) => void;

  // Edge

  onShowEdgeDetail: (identifier: string) => void;

  onEditEdge: (identifier: string) => void;

  onCreateEdgeProfile: (identifier: string) => void;

  onHideEdge: (identifier: string) => void;

  onDeleteEdge: (identifier: string) => void;

  // Connections

  onCreateConnectionToNode: (sourceIdentifier: string, targetIdentifier: string) => void;

  onCreateConnectionToNothing: (sourceIdentifier: string, position: Position) => void;


}
