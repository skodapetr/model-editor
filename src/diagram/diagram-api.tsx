
/**
 * Actions that can be executed on the editor component.
 */
export interface DiagramActions {


  // Groups

  /**
   * @returns The list of groups registered in diagram.
   */
  getGroups(): Group[];


  /**
   * Registers new group to the diagram.
   * @param group is the group to be registered.
   * @param content is optional content of the group.
   */
  addGroup(group: Group, content?: string[]): void;


  /**
   * Removes given groups from diagram.
   * @param groups is list of identifiers of the to be removed groups.
   */
  removeGroups(groups: string[]): void;


  /**
   * Sets the content of given group to given content.
   * @param group is the group to set content for.
   * @param content is the new content of the group.
   */
  setGroup(group: Group, content: string[]): void;


  /**
   * The content of group as node identifiers.
   * @param group is the group to get content for.
   * @returns The content of group as node identifiers.
   */
  getGroupContent(group: Group): string[];


  // Nodes

  /**
   * @returns The nodes registered inside diagram.
   */
  getNodes(): Node[];


  /**
   * Adds given nodes to the diagram.
   * @param nodes is the list of nodes to be added to the diagram.
   */
  addNodes(nodes: Node[]): void;


  /**
   * Updates diagram's nodes matching the given ones.
   * @param nodes are the updated versions of the matching nodes.
   */
  updateNodes(nodes: Node[]): void;


  /**
   * Updates the nodes' positions.
   * @param nodes is map, where identifier of node is mapped to the node's new position.
   */
  updateNodesPosition(nodes: { [identifier: string]: Position }): void;


  /**
   * Removes nodes whose identifiers match the given ones.
   * @param identifiers are identifiers of the to be removed nodes.
   */
  removeNodes(identifiers: string[]): void;


  // Edges

  // TODO: Same as nodes, so just copy after feedback to the node documentation.
  getEdges(): Edge[];

  addEdges(edges: Edge[]): void;

  updateEdges(edges: Edge[]): void;

  setEdgesWaypointPosition(positions: { [identifier: string]: Position[] }): void;

  removeEdges(identifiers: string[]): void;


  // Selection

  /**
   * @returns Currently selected nodes within diagram.
   */
  getSelectedNodes(): Node[];


  /**
   * Sets diagram's node selection to the given nodes.
   * @param nodes are the identifiers of the nodes,
   * which will become the new content of the node selection.
   */
  setSelectedNodes(nodes: string[]): void;


  /**
   * @returns Currently selected edges within diagram.
   */
  getSelectedEdges(): Edge[];


  /**
   * Sets diagram's edge selection to the given edges.
   * @param edges are the identifiers of the edges,
   * which will become the new content of the edge selection.
   */
  setSelectedEdges(edges: string[]): void;


  /**
   * Sets content of the diagram.
   * @returns When the diagram is ready.
   */
  setContent(nodes: Node[], edges: Edge[]): Promise<void>;


  // Viewport

  /**
   * @returns The current position of viewport and its width and height.
   */
  getViewport(): { position: Position, width: number, height: number };


  /**
   * Sets the viewport's position to given coordinates.
   * @param x is the new x-coordinate of the viewport.
   * @param y is the new y-coordinate of the viewport.
   */
  setViewportToPosition(x: number, y: number): void;


  /**
   * Centers diagram's viewport to node with given identifier.
   * @param identifier is the identifier of the node to center viewport to.
   */
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


  /**
   * This property represents the initial position to which the node is placed at the moment of addition to the diagram.
   * On other occasions this property is ignored.
   */
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

  /**
   * This property stores the method, which is called when user opens node's detail.
   * @param identifier is the identifier of the node for which the detail was shown.
   */
  onShowNodeDetail: (identifier: string) => void;


  /**
   * This property stores the method, which is called when user starts editing node.
   * @param identifier is the identifier of the node which is being edited.
   */
  onEditNode: (identifier: string) => void;


  /**
   * This property stores the method, which is called when user starts creating node's profile.
   * @param identifier is the identifier of the node of which the profile is being created.
   */
  onCreateNodeProfile: (identifier: string) => void;


  /**
   * This property stores the method, which is called when user hides node, i. e. removes it from canvas.
   * @param identifier is the identifier of the node, which is newly hidden.
   */
  onHideNode: (identifier: string) => void;


  /**
   * This property stores the method, which is called when user deletes node.
   * @param identifier is the identifier of the deleted node.
   */
  onDeleteNode: (identifier: string) => void;


  // Edge

  // TODO: Documentation is the same as for nodes, so just copy it after feedback.
  onShowEdgeDetail: (identifier: string) => void;

  onEditEdge: (identifier: string) => void;

  onCreateEdgeProfile: (identifier: string) => void;

  onHideEdge: (identifier: string) => void;

  onDeleteEdge: (identifier: string) => void;


  // Selection

  /**
   * This property stores the method, which is called when user changes the selection.
   * Callback is registered on both node and edge selection.
   * @param nodes are identifiers of the nodes representing the new node selection.
   * @param edges are identifiers of the edges representing the new edge selection.
   */
  onSelectionDidChange: (nodes: string[], edges: string[]) => void;


  // Connections

  /**
   * This property stores the method, which is called when user creates connection inside diagram.
   * @param sourceIdentifier is the identifier of the source node of the connection.
   * @param targetIdentifier is the identifier of the target node of the connection.
   */
  onCreateConnectionToNode: (sourceIdentifier: string, targetIdentifier: string) => void;


  /**
   * This property stores the method, which is called when user creates "empty" connection,
   * i. e. connection from node to canvas.
   * @param sourceIdentifier is the identifier of the node, where the connection started.
   * @param position is the position on canvas, where the connection ended.
   */
  onCreateConnectionToNothing: (sourceIdentifier: string, position: Position) => void;
}
