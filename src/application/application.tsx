import { useEffect, useMemo } from "react";

import { VerticalSplitter } from "../components/splitter";
import { createLogger } from ".";
import { Diagram, useDiagram, DiagramCallbacks, Node, Edge } from "../diagram";

import "./application.css";

const logger = createLogger(import.meta.url);

const nodes: Node[] = [
  {
    identifier: "node-000",
    iri: "dcat:Catalog",
    initialPosition: { x: 110, y: 160 },
    label: "dcat:Catalog",
    items: [],
    group: null,
  }, {
    identifier: "node-001",
    iri: "dcat:CatalogRecord",
    initialPosition: { x: 510, y: 160 },
    label: "dcat:CatalogRecord",
    items: [],
    group: null,
  }, {
    identifier: "node-002",
    iri: "dcat-ap:Catalog",
    initialPosition: { x: 110, y: 350 },
    label: "dcat-ap:Catalog",
    items: [],
    group: null,
  },
];

const edges: Edge[] = [
  {
    identifier: "edge-000",
    source: "node-000",
    target: "node-001",
    waypoints: [
      { position: { x: 360, y: 170 } },
      { position: { x: 360, y: 60 } },
      { position: { x: 810, y: 60 } },
    ]
  }, {
    identifier: "edge-001",
    source: "node-000",
    target: "node-002",
    waypoints: [],
  },
];

export function Application() {
  logger.render("Application");

  const callbacks = useMemo<DiagramCallbacks>(() => {
    return {

      onShowNodeDetail: (id) => console.log("Application.onShowNodeDetail", { id }),

      onEditNode: (id) => console.log("Application.onEditNode", { id }),

      onCreateNodeProfile: (id) => console.log("Application.onCreateNodeProfile", { id }),

      onHideNode: (id) => console.log("Application.onHideNode", { id }),

      onDeleteNode: (id) => console.log("Application.onDeleteNode", { id }),

      onShowEdgeDetail: (id) => console.log("Application.onShowEdgeDetail", { id }),

      onEditEdge: (id) => console.log("Application.onEditEdge", { id }),

      onCreateEdgeProfile: (id) => console.log("Application.onCreateEdgeProfile", { id }),

      onHideEdge: (id) => console.log("Application.onHideEdge", { id }),

      onDeleteEdge: (id) => console.log("Application.onDeleteEdge", { id }),

      onCreateConnectionToNode: (source, target) => {
        console.log("Application.onCreateConnectionToNode", { source, target });
        // As a default we just add an edge.
        diagram.actions().addEdges([{
          identifier: "edge-003",
          source,
          target,
          waypoints: [],
        }]);
      },

      onCreateConnectionToNothing: (source, position) => console.log("Application.onCreateConnectionToNothing", { source, position }),

      onSelectionDidChange: (nodes, edges) => console.log("Application.onSelectionDidChange", { nodes, edges }),

    };
  }, []);

  // We use this hook to interface with the diagram.
  // We provide a callbacks to be called when something happen.
  // We get back actions a function, we can call to do something with the editor.
  const diagram = useDiagram(callbacks);

  useEffect(() => {
    if (diagram.isReady) {
      diagram.actions().setContent(nodes, edges);
    }
  }, [diagram.actions, diagram.isReady])

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="bg-slate-300 p-1">
        Application main menu
        &nbsp;
        <button onClick={() => {
          // As a default we just add a node.
          diagram.actions().addNodes([{
            identifier: "node-003",
            iri: "dcat-ap-cz:Catalog",
            initialPosition: { x: 510, y: 510 },
            label: "dcat-ap-cz:Catalog",
            items: [],
            group: null,
          }]);
        }}>
          Add component
        </button>
      </div>
      <VerticalSplitter className="grow" initialSize={20}>
        <div className="bg-slate-300 p-1 border-t h-full">
          Left panel
        </div>
        <div className="w-full h-full">
          <Diagram diagram={diagram} />
        </div>
      </VerticalSplitter>
    </div>
  )
}
