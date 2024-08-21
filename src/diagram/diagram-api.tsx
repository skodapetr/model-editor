/**
 * Allow execution of actions.
 */
export interface DiagramActions {

  /**
   * Return all nodes in the diagram.
   */
  getNodes(): Node[];

  /**
   * Add or update the node.
   */
  setNode(node: Node): void;

  /**
   * Remove the node.
   */
  removeNode(identifier: string): void;

  /**
   * Return all edges in the diagram.
   */
  getEdges(): Edge[];

  /**
   * Add or update the edge.
   */
  setEdge(edge: Edge): void;

  /**
   * Remove the edge.
   */
  removeEdge(identifier: string): void;

  /**
   * Set content to the diagram.
   * @returns When the diagram is ready.
   */
  setContent(nodes: Node[], edges: Edge[]): Promise<void>;

  /**
   * Move viewport to given position.
   */
  setViewToPosition(x: number, y: number): void;

  /**
   * Move viewport so it is centered on node with given identifier.
   */
  focusNode(identifier: string): void;

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

  onEditEdge: (identifier: string) => void;

  onCreateEdgeProfile: (identifier: string) => void;

  onHideEdge: (identifier: string) => void;

  onDeleteEdge: (identifier: string) => void;

  // Node & Edge

  onCreateEdge: (sourceIdentifier: string, targetIdentifier: string, position: Position) => void;


}
