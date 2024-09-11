
/**
 * Actions that can be executed on the editor component.
 */
export interface DiagramActions {

  // Groups

  getGroups(): Group[];

  addGroup(group: Group, content?: string[]): void;

  removeGroups(groups: string[]): void;

  setGroup(group: Group, content: string[]): void;

  getGroupContent(group: Group): string[];

  // Nodes

  getNodes(): Node[];

  addNodes(node: Node[]): void;

  updateNodes(node: Node[]): void;

  updateNodesPosition(nodes: { [identifier: string]: Position }): void;

  removeNodes(identifier: string[]): void;

  // Edges

  getEdges(): Edge[];

  addEdges(edge: Edge[]): void;

  updateEdges(edge: Edge[]): void;

  setEdgesWaypointPosition(positions: { [identifier: string]: Position[] }): void;

  removeEdges(identifier: string[]): void;

  // Selection

  getSelectedNodes(): Node[];

  setSelectedNodes(nodes: string[]): void;

  getSelectedEdges(): Edge[];

  setSelectedEdges(edges: string[]): void;

  /**
   * Set content to the diagram.
   * @returns When the diagram is ready.
   */
  setContent(nodes: Node[], edges: Edge[]): Promise<void>;

  // Viewport

  getViewport(): { position: Position, width: number, height: number };

  setViewportToPosition(x: number, y: number): void;

  centerViewportToNode(identifier: string): void;

}

/**
 * Non-visual node used to represent group of other nodes.
 */
export type Group = {

  identifier: string;

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

  /**
   * Group this node belongs to.
   */
  group: string | null;

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

  initialWaypoints: { position: Position }[];

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

  // Selection

  onSelectionDidChange: (nodes: string[], edges: string[]) => void;

  // Connections

  onCreateConnectionToNode: (sourceIdentifier: string, targetIdentifier: string) => void;

  onCreateConnectionToNothing: (sourceIdentifier: string, position: Position) => void;


}
