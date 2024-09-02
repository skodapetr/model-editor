import { useCallback, useEffect, useRef, useState, useMemo, createContext } from "react";
import {
  addEdge,
  useStoreApi,
  useReactFlow,
  useNodesState,
  useEdgesState,
  useNodesInitialized,
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
} from "@xyflow/react";

import { UseDiagramType } from "./diagram-hook";
import { DiagramActions, DiagramCallbacks } from "./diagram-api";
import { EdgeData, NodeData } from "./diagram-internal-model";
import { EdgeContextMenuType } from "./edge/edge-context-menu";
import { EntityNodeName} from "./node/entity-node";
import { PropertyEdgeName} from "./edge/property-edge";
import { type AlignmentController, useAlignmentController } from "./features/alignment-controller-v2";

export type NodeType = Node<NodeData>;

export type EdgeType = Edge<EdgeData>;

type ReactFlowContext = ReactFlowInstance<NodeType, EdgeType>;

type OpenEdgeContextMenuHandler = (edgeId: string, waypointIndex: number | null, x: number, y: number) => void;

/**
 * We use context to provide nodes, edges and other with access to actions and callbacks.
 */
interface DiagramContextType {

  actions: DiagramActions;

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
   */
  edgeContextMenu: EdgeContextMenuType | null;

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
  const store = useStoreApi();
  const reactFlow = useReactFlow<NodeType, EdgeType>();
  const [nodes, setNodes] = useNodesState<NodeType>([]);
  const [edges, setEdges] = useEdgesState<EdgeType>([]);
  const alignment = useAlignmentController({ reactFlowInstance: reactFlow });

  // The initialized is set to false when new node is added and back to true once the size is determined.
  const reactFlowInitialized = useNodesInitialized();

  const onChangeSelection = useCallback(createChangeSelectionHandler(), []);
  useOnSelectionChange({ onChange: onChangeSelection });

  const onNodesChange = useCallback(createNodesChangeHandler(setNodes, alignment), [setNodes, alignment]);

  const onEdgesChange = useCallback(createEdgesChangeHandler(setEdges), [setEdges]);

  const onConnect = useCallback(createConnectHandler(setEdges, api), [setEdges]);

  const connectingNodeId = useRef<string | null>(null);

  const onConnectStart = useCallback(createConnectStartHandler(connectingNodeId), []);

  const onConnectEnd = useCallback(createConnectEndtHandler(connectingNodeId, reactFlow), [reactFlow]);

  const isValidConnection = useCallback(createIsValidConnection(), []);

  const onDragOver = useCallback(createDragOverHandler(), []);

  const onDrop = useCallback(createDropHandler(reactFlow), [reactFlow.screenToFlowPosition]);

  const actions = useMemo(() => createActions(reactFlow, setNodes, setEdges, alignment), [reactFlow, setNodes, setEdges]);

  const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuType | null>(null);
  const onOpenEdgeContextMenu = useCallback(createOpenEdgeContextMenu(setEdgeContextMenu), [setEdgeContextMenu]);
  const context = useMemo(() => createDiagramContext(api, onOpenEdgeContextMenu), [api]);

  const onNodeDrag = useCallback(createOnNodeDragHandler(), []);
  const onNodeDragStart = useCallback(createOnNodeDragStartHandler(alignment), [alignment]);
  const onNodeDragStop = useCallback(createOnNodeDragStopHandler(alignment), [alignment]);

  // Register actions to API.
  useEffect(() => api.registerActionCallback(actions), [api, actions]);

  return {
    nodes,
    edges,
    context,
    edgeContextMenu,
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

const createOnNodeDragStartHandler = (alignment) => {
  return (event: React.MouseEvent, node: Node, nodes: Node[]) => {
    alignment.alignmentSetUpOnNodeDragStart(event, node);
  }
};

const createOnNodeDragStopHandler = (alignment) => {
  return (event: React.MouseEvent, node: Node, nodes: Node[]) => {
    alignment.alignmentCleanUpOnNodeDragStop(node);
  }
};

const createChangeSelectionHandler = () => {
  return (params: OnSelectionChangeParams) => {
    console.log("useDiagramController.onChange", { params });
  }
}

const createNodesChangeHandler = (setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>, alignment: AlignmentController) => {
  return (changes: NodeChange<NodeType>[]) => {
    // This is called also when initial nodes are addded.
    console.log("useDiagramController.onNodesChange", { changes });

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
    console.log("useDiagramController.onEdgesChange", { changes });
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges))
  }
}

const createConnectHandler = (setEdges: React.Dispatch<React.SetStateAction<EdgeType[]>>, api: UseDiagramType) => {
  return (connection: Connection) => {
    console.log("useDiagramController.onConnect", { connection });
    // We can modify the connection here or use "defaultEdgeOptions".
    // setEdges((edges) => addEdge(connection, edges));
    // setEdges((edges) => addEdge({
    //   ...connection,
    //   label: "TBA",
    //   type: "property-edge",
    //   data: {
    //     waypoints: [],
    //     callbacks: {
    //       onOpenContextMenu: () => console.log("OPEN MENU!")
    //     },
    //   }
    // }, edges));
  };
}

const createConnectStartHandler = (connectingNodeId: React.MutableRefObject<string | null>): OnConnectStart => {
  return (_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }
}

const createConnectEndtHandler = (connectingNodeId: React.MutableRefObject<string | null>, reactFlow: ReactFlowInstance<NodeType, EdgeType>): OnConnectEnd => {
  return (event) => {
    // We only want to create a new node if the connection ends on the pane.
    const targetIsPane = (event.target as Element).classList.contains("react-flow__pane");
    if (targetIsPane && connectingNodeId.current) {
      // Get position on the canvas.
      const panePosition = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const source = reactFlow.getNode(connectingNodeId.current);
      console.log("useDiagramController.onConnectEnd", { source, position: panePosition });
      // We can call setNodes and setEdges with the new item.
    }
  }
}

const createIsValidConnection = (): IsValidConnection<EdgeType> => {
  return (edge: EdgeType | Connection) => {
    // We can return false to prevent addition of an edge.
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

const createOpenEdgeContextMenu = (setEdgeContextMenu: React.Dispatch<React.SetStateAction<EdgeContextMenuType | null>>): OpenEdgeContextMenuHandler => {
  return (edgeIdentifier: string, waypointIndex: number | null, x: number, y: number) => {
    console.log("createOpenEdgeContextMenu", {edgeIdentifier, waypointIndex});
    setEdgeContextMenu({ edgeIdentifier, waypointIndex, x, y });
    // We need to register to close the menu with any click.
    const closeMenu = () => {
      console.log("on close");
      setEdgeContextMenu(null);
      document.removeEventListener("mousedown", closeMenu);
    };
    document.addEventListener("mousedown", closeMenu)
  }
};

const createActions = (
  reactFlow: ReactFlowInstance<NodeType, EdgeType>,
  setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>,
  setEdges: React.Dispatch<React.SetStateAction<EdgeType[]>>,
  alignment: AlignmentController
): DiagramActions => {
  return {
    getNodes() {
      console.log("getNodes");
      return [];
    },
    setNode(node) {
      console.log("setNode", { node });
    },
    removeNode(identifier) {
      console.log("removeNode", { identifier });
    },
    getEdges() {
      console.log("getEdges");
      return [];
    },
    setEdge(edge) {
      console.log("setEdge", { edge });
    },
    removeEdge(identifier) {
      console.log("identifier", { identifier });
    },
    async setContent(nodes, edges) {
      // Convert and set nodes.
      const nextNodes : NodeType[] = nodes.map((node) : NodeType => ({
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
      }));

      setNodes(nextNodes);

      // Convert and set edges.
      const nextEdges: EdgeType[] = edges.map((edge): EdgeType => ({
        id: edge.identifier,
        source: edge.source,
        target: edge.target,
        type: PropertyEdgeName,
        data: {
          waypoints: edge.waypoints.map((waypoint) => ({
            x: waypoint.position.x,
            y: waypoint.position.y
          })),
        }
      }));

      alignment.onReset();
      setEdges(nextEdges);
      console.log("setContent", { nodes, edges });
    },
    setViewToPosition(x, y) {
      console.log("setViewToPosition", { x, y });
    },
    focusNode(identifier) {
      console.log("focusNode", { identifier });
    },
  };
}

const createDiagramContext = (api: UseDiagramType, onOpenEdgeContextMenu: OpenEdgeContextMenuHandler): DiagramContextType => {
  return {
    actions: api.actions,
    callbacks: api.callbacks,
    onOpenEdgeContextMenu,
  };
};

/**
 * Move view to given node.
 * https://reactflow.dev/examples/misc/use-react-flow-hook
 */
const focusNode = (reactFlow: ReactFlowContext, node: Node) => {
  const x = node.position.x + (node.measured?.width ?? 0) / 2;
  const y = node.position.y + (node.measured?.height ?? 0) / 2;
  const zoom = 1.85;
  reactFlow.setCenter(x, y, { zoom, duration: 1000 });
};

