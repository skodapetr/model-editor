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
  }, {
    identifier: "node-001",
    iri: "dcat:CatalogRecord",
    initialPosition: { x: 510, y: 160 },
    label: "dcat:CatalogRecord",
    items: [],
  }, {
    identifier: "node-002",
    iri: "dcat-ap:Catalog",
    initialPosition: { x: 110, y: 510 },
    label: "dcat-ap:Catalog",
    items: [],
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

      onShowNodeDetail: (identifier) => console.log("Application.onShowNodeDetail", arguments),

      onEditNode: (identifier) => console.log("Application.onEditNode", arguments),

      onCreateNodeProfile: (identifier) => console.log("Application.onCreateNodeProfile", arguments),

      onHideNode: (identifier) => console.log("Application.onHideNode", arguments),

      onDeleteNode: (identifier) => console.log("Application.onDeleteNode", arguments),

      onEditEdge: (identifier) => console.log("Application.onEditEdge", arguments),

      onCreateEdgeProfile: (identifier) => console.log("Application.onCreateEdgeProfile", arguments),

      onHideEdge: (identifier) => console.log("Application.onHideEdge", arguments),

      onDeleteEdge: (identifier) => console.log("Application.onDeleteEdge", arguments),

      onCreateEdge: (sourceIdentifier, targetIdentifier, position) => console.log("Application.onCreateEdge", arguments),

    };
  }, []);

  const diagram = useDiagram(callbacks);

  useEffect(() => {
    if (diagram.isReady) {
      diagram.actions.setContent(nodes, edges);
    }
  }, [diagram.actions, diagram.isReady])

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="bg-slate-300 p-1">
        Application main menu
        &nbsp;
        <button onClick={() => {
          console.log("Add component")
          diagram.actions.setNode({
            identifier: "node-003",
            iri: "dcat-ap-cz:Catalog",
            initialPosition: { x: 510, y: 510 },
            label: "dcat-ap-cz:Catalog",
            items: [],
          });
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
