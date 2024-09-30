import React, { useCallback, useEffect, useState, useMemo, createContext } from "react";
import {
  useReactFlow,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
  applyNodeChanges,
  applyEdgeChanges,
  type ReactFlowInstance,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type OnSelectionChangeParams,
  type OnConnectStart,
  type OnConnectEnd,
  type IsValidConnection,
  FinalConnectionState,
  Viewport,
} from "@xyflow/react";

import { UseDiagramType } from "./diagram-hook";
import { DiagramActions, DiagramCallbacks, Node as ApiNode, Edge as ApiEdge, ViewportDimensions } from "./diagram-api";
import { EdgeData, NodeData } from "./diagram-internal-model";
import { EdgeToolbarProps } from "./edge/edge-toolbar";
import { EntityNodeName } from "./node/entity-node";
import { PropertyEdgeName } from "./edge/property-edge";

import { type AlignmentController, useAlignmentController } from "./features/alignment-controller-v2";

export type NodeType = Node<NodeData>;

export type EdgeType = Edge<EdgeData>;

type ReactFlowContext = ReactFlowInstance<NodeType, EdgeType>;

type OpenEdgeContextMenuHandler = (edgeId: string, waypointIndex: number | null, x: number, y: number) => void;

/**
 * We use context to acess to callbacks to diagram content, like nodes and edges.
 */
interface DiagramContextType {

  callbacks: DiagramCallbacks;

  onOpenEdgeContextMenu: OpenEdgeContextMenuHandler;

}

export const DiagramContext = createContext<DiagramContextType | null>(null);

interface UseDiagramControllerType {

  /**
   * Nodes to render using reactflow.
   */
  nodes: NodeType[];

  /**
   * Edges to render using reactflow.
   */
  edges: EdgeType[];

  /**
   * Context to provide for the diagram components.
   */
  context: DiagramContextType;

  /**
   * Model for edge context menu.
   * Can be null when there is nothing to render.
   * Yet even when not null, the toolbar is rendered
   * only when the edge is selected.
   */
  edgeToolbar: EdgeToolbarProps | null;

  onNodesChange: OnNodesChange<NodeType>;

  onEdgesChange: OnEdgesChange<EdgeType>;

  onConnect: OnConnect;

  onConnectStart: OnConnectStart;

  onConnectEnd: OnConnectEnd;

  onDragOver: React.DragEventHandler;

  onDrop: React.DragEventHandler;

  isValidConnection: IsValidConnection<EdgeType>;


  onNodeDrag: (event: React.MouseEvent, node: Node, nodes: Node[]) => void;
  onNodeDragStart: (event: React.MouseEvent, node: Node, nodes: Node[]) => void;
  onNodeDragStop: (event: React.MouseEvent, node: Node, nodes: Node[]) => void;

  alignmentController: AlignmentController;
};

export function useDiagramController(api: UseDiagramType): UseDiagramControllerType {
  // We can use useStore get low level access.
  const reactFlow = useReactFlow<NodeType, EdgeType>();
  const [nodes, setNodes] = useNodesState<NodeType>([]);
  const [edges, setEdges] = useEdgesState<EdgeType>([]);
  const [edgeToolbar, setEdgeToolbar] = useState<EdgeToolbarProps | null>(null);

  const alignment = useAlignmentController({ reactFlowInstance: reactFlow });

  // The initialized is set to false when new node is added and back to true once the size is determined.
  // const reactFlowInitialized = useNodesInitialized();

  const onChangeSelection = useCallback(createChangeSelectionHandler(), [setEdgeToolbar]);
  useOnSelectionChange({ onChange: (onChangeSelection) });

  const onNodesChange = useCallback(createNodesChangeHandler(setNodes, alignment), [setNodes, alignment]);

  const onEdgesChange = useCallback(createEdgesChangeHandler(setEdges), [setEdges]);

  const onConnect = useCallback(createConnectHandler(), [setEdges]);

  const onConnectStart = useCallback(createConnectStartHandler(), []);

  const onConnectEnd = useCallback(createConnectEndHandler(reactFlow, api), [reactFlow, api]);

  const isValidConnection = useCallback(createIsValidConnection(), []);

  const onDragOver = useCallback(createDragOverHandler(), []);

  const onDrop = useCallback(createDropHandler(reactFlow), [reactFlow.screenToFlowPosition]);

  const actions = useMemo(() => createActions(reactFlow, setNodes, setEdges, alignment), [reactFlow, setNodes, setEdges, alignment]);

  const onOpenEdgeToolbar = useCallback(createOpenEdgeToolbar(setEdgeToolbar), [setEdgeToolbar]);
  const context = useMemo(() => createDiagramContext(api, onOpenEdgeToolbar), [api]);

  // Register actions to API.
  useEffect(() => api.registerActionCallback(actions), [api, actions]);


  const onNodeDrag = useCallback(createOnNodeDragHandler(), []);
  const onNodeDragStart = useCallback(createOnNodeDragStartHandler(alignment), [alignment]);
  const onNodeDragStop = useCallback(createOnNodeDragStopHandler(alignment), [alignment]);

  return {
    nodes,
    edges,
    context,
    edgeToolbar,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onDragOver,
    onDrop,
    isValidConnection,

    onNodeDrag,
    onNodeDragStart,
    onNodeDragStop,
    alignmentController: alignment,
  };
};


const createOnNodeDragHandler = () => {
  return (event: React.MouseEvent, node: Node, nodes: Node[]) => {
    // EMPTY
  }
};

const createOnNodeDragStartHandler = (alignment: AlignmentController) => {
  return (event: React.MouseEvent, node: Node, nodes: Node[]) => {
    alignment.alignmentSetUpOnNodeDragStart(node);
  }
};

const createOnNodeDragStopHandler = (alignment: AlignmentController) => {
  return (event: React.MouseEvent, node: Node, nodes: Node[]) => {
    alignment.alignmentCleanUpOnNodeDragStop(node);
  }
};


const createChangeSelectionHandler = () => {
  return (_: OnSelectionChangeParams) => {
    // We can react on change events here.

    // Originally the idea was to call setEdgeToolbar(null),
    // to hide the toolbar when there is change in the selection.
    // But the issue is that since we use only one menu, we show the menu,
    // before the selection change happen.
    // As a result the toolbar was open and closed, causing a blink.
    // The solution of choice was to draw an inspiration from NodeToolbar
    // and watch for edge selection in EdgeToolbar.
  }
}

const createNodesChangeHandler = (setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>, alignment: AlignmentController) => {
  return (changes: NodeChange<NodeType>[]) => {
    // We can alter the change here ... for example allow only x-movement.
    // changes.forEach(change => {
    //   if (change.type === "position") {
    //     const positionChange = change as NodePositionChange;
    //     const node = reactFlow.getNode(change.id);
    //     positionChange.position.y = node?.position.y;
    //   }
    // });

    alignment.alignmentNodesChange(changes);
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  }
}

const createEdgesChangeHandler = (setEdges: React.Dispatch<React.SetStateAction<EdgeType[]>>) => {
  return (changes: EdgeChange<EdgeType>[]) => {
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges))
  }
}

const createConnectHandler = () => {
  return (_: Connection) => {
    // Here we would normally handle creation of a new edge in reaction
    // to DiagramFlow editor action.
    // Instead we handle the action in createConnectEndHandler method.
    // Therefore, there is nothing hapenning here.
  };
}

const createConnectStartHandler = (): OnConnectStart => {
  return () => {
    // Should there be a need we can react to on start connection event.
    // At one point we use this to store reference to the connection source,
    // yet as we can get it in createConnectEndHandler, there is no need to do it anymore.
  }
}

const createConnectEndHandler = (reactFlow: ReactFlowInstance<NodeType, EdgeType>, api: UseDiagramType): OnConnectEnd => {
  // This handler is called when user finish dragging a new connection.
  // We need to handle this action using the API, notifing the owner about an event.
  // There are two possible events:
  // 1) User dragged the connection to a node.
  // 2) User dragged the connection to an empty space.
  return (event: MouseEvent | TouchEvent, connection: FinalConnectionState) => {
    const source = connection.fromNode;
    const position = connection.to;
    if (source === null || position === null) {
      // We have no source or position of the target.
      return;
    }
    const targetIsPane = (event.target as Element).classList.contains("react-flow__pane");
    if (targetIsPane) {
      api.callbacks.onCreateConnectionToNothing(source.id, position);
    } else {
      // If user have not attached the node to the handle, we get no target.
      if (connection.toNode === null) {
        const nodes = reactFlow.getIntersectingNodes({ x: position.x, y: position.y, width: 1, height: 1 });
        if (nodes.length === 0) {
          api.callbacks.onCreateConnectionToNothing(source.id, position);
        } else {
          api.callbacks.onCreateConnectionToNode(source.id, nodes[0].id);
        }
      } else {
        api.callbacks.onCreateConnectionToNode(source.id, connection.toNode.id);
      }
    }
  }
}

const createIsValidConnection = (): IsValidConnection<EdgeType> => {
  return (_: EdgeType | Connection) => {
    // We can return false to prevent addition of an edge to a given handle.
    // Yet as we have no handle types here, we can alwayes return true.
    return true;
  }
};

const createDragOverHandler = (): React.DragEventHandler => {
  return (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }
}

const createDropHandler = (reactFlow: ReactFlowInstance<NodeType, EdgeType>): React.DragEventHandler => {
  return (event: React.DragEvent) => {
    event.preventDefault();
    const position = reactFlow.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    console.log("useDiagramController.onDrop", { position });
  }
}

const createOpenEdgeToolbar = (setEdgeToolbar: React.Dispatch<React.SetStateAction<EdgeToolbarProps | null>>): OpenEdgeContextMenuHandler => {
  return (edgeIdentifier: string, waypointIndex: number | null, x: number, y: number) => {
    setEdgeToolbar({ edgeIdentifier, waypointIndex, x, y });
  }
};

/**
 * Creates implemenation of action that could be called from the owner.
 */
const createActions = (
  reactFlow: ReactFlowInstance<NodeType, EdgeType>,
  setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>,
  setEdges: React.Dispatch<React.SetStateAction<EdgeType[]>>,
  alignment: AlignmentController
): DiagramActions => {
  return {
    getNodes() {
      console.log("Diagram.getNodes");
      return [];
    },
    addNodes(nodes) {
      console.log("Diagram.addNodes", { nodes });
    },
    updateNodes(nodes) {
      console.log("Diagram.updateNodes", { nodes });
    },
    removeNodes(identifiers) {
      console.log("Diagram.removeNodes", { identifiers });
    },
    getEdges() {
      console.log("Diagram.getEdges");
      return [];
    },
    addEdges(edges) {
      reactFlow.addEdges(edges.map(edgeToEdgeType));
      console.log("Diagram.addEdges", { edges });
    },
    updateEdges(edges) {
      console.log("Diagram.updateEdges", { edges });
    },
    removeEdges(identifiers) {
      console.log("Diagram.removeEdges", { identifiers });
    },
    async setContent(nodes, edges) {
      setNodes(nodes.map(nodeToNodeType));
      alignment.onReset();
      setEdges(edges.map(edgeToEdgeType));
      console.log("Diagram.setContent", { nodes, edges });
    },
    setViewportToPosition(x, y) {
      console.log("Diagram.setViewToPosition", { x, y });
    },
    centerViewportToNode(identifier) {
      console.log("Diagram.focusNode", { identifier });
      const node = reactFlow.getNode(identifier);
      if (node !== undefined) {
        focusNodeAction(reactFlow, node);
      }
    },

    getViewport() {
      const viewport = reactFlow.getViewport();
      // I have zero idea why is it switched, but it is
      const position = { x: -viewport.x, y: -viewport.y };
      const flow__viewport = document.querySelector(".react-flow__viewport") as HTMLElement | null;
      const viewportDimensionsToReturn = {
          position,
          width: (flow__viewport?.clientWidth ?? 0),
          height: (flow__viewport?.clientHeight ?? 0)
      };
      convertViewUsingZoom(viewportDimensionsToReturn, viewport.zoom);
      return viewportDimensionsToReturn;
    },
  };
}

const convertViewUsingZoom = (view: ViewportDimensions, zoom: number): void => {
  const zoomReciprocal = 1 / zoom;
  view.position.x *= zoomReciprocal;
  view.position.y *= zoomReciprocal;
  view.width *= zoomReciprocal;
  view.height *= zoomReciprocal;
};

const nodeToNodeType = (node: ApiNode): NodeType => {
  return {
    id: node.identifier,
    type: EntityNodeName,
    position: {
      x: node.initialPosition.x,
      y: node.initialPosition.y,
    },
    data: {
      label: node.label,
      iri: node.iri,
      items: node.items,
    }
  };
}

const edgeToEdgeType = (edge: ApiEdge): EdgeType => {
  return {
    id: edge.identifier,
    source: edge.source,
    target: edge.target,
    type: PropertyEdgeName,
    data: {
      waypoints: edge.initialWaypoints.map((waypoint) => ({
        x: waypoint.position.x,
        y: waypoint.position.y
      })),
    }
  };
}

/**
 * Move view to given node with animation.
 * https://reactflow.dev/examples/misc/use-react-flow-hook
 */
const focusNodeAction = (reactFlow: ReactFlowContext, node: Node) => {
  const x = node.position.x + (node.measured?.width ?? 0) / 2;
  const y = node.position.y + (node.measured?.height ?? 0) / 2;
  const zoom = 1.85;
  reactFlow.setCenter(x, y, { zoom, duration: 1000 });
};

const createDiagramContext = (api: UseDiagramType, onOpenEdgeContextMenu: OpenEdgeContextMenuHandler): DiagramContextType => {
  return {
    callbacks: api.callbacks,
    onOpenEdgeContextMenu,
  };
};

