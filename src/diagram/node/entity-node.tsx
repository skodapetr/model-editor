import { useContext, useState } from "react";
import { Handle, Position, NodeToolbar, useStore, type NodeProps, type Node, type ReactFlowState } from "@xyflow/react";

import { NodeData } from "../diagram-internal-model";
import { DiagramContext } from "../diagram-controller";

import "./entity-node.css";

// We can select zoom option and hide content when zoom is on given threshold.
// const zoomSelector = (state: ReactFlowState) => state.transform[2] >= 0.9;
// const showContent = useStore(zoomSelector);

export const EntityNode = (props: NodeProps<Node<NodeData>>) => {
  // We can use the bellow to set size based on the content.
  // useLayoutEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.style.width = `${data.label.length * 8}px`;
  //   }
  // }, [data.label.length]);

  // We can use bellow to get information about active connection
  // and for example highligh possible targets.
  // const connection = useConnection();

  // We can use props.selected to show source port.

  return (
    <>
      {props.selected ? <SelectedHighlight /> : null}
      <div style={{ width: "12em", height: "5em" }} className={"border border-black entity-node"}>
        <EntityNodeToolbar {...props} />
        <div className="entity-node-content">
          <div className="drag-handle bg-slate-300" >
            {props.data.label}
          </div>
          <div>
            Content ...
          </div>
        </div>
        {/* We just add targets on all sides. */}
        <Handle type="target" position={Position.Top} />
        <Handle type="target" position={Position.Right} />
        <Handle type="target" position={Position.Bottom} />
        <Handle type="target" position={Position.Left} />
        {/* We need this one as a permanent source. */}
        <Handle type="source" position={Position.Right} />
      </div>
    </>
  )
};

function SelectedHighlight() {
  return (
    <div style={{ width: "12.5em", height: "5.5em", position: "fixed", zIndex: -1, left: "-.25em", top: "-.25em" }} className={"entity-node selected"} />
  )
}

function EntityNodeToolbar(props: NodeProps<Node<NodeData>>) {
  const context = useContext(DiagramContext);
  const onShowDetail = () => context?.callbacks.onShowNodeDetail(props.id);
  const onEdit = () => context?.callbacks.onEditNode(props.id);
  const onCreateProfile = () => context?.callbacks.onCreateNodeProfile(props.id);
  const onHide = () => context?.callbacks.onHideNode(props.id);
  const onDelete = () => context?.callbacks.onDeleteNode(props.id);
  return (
    <>
      <NodeToolbar position={Position.Top} className="flex gap-2 entity-node-toolbar" >
        <button onClick={onShowDetail}>ℹ</button>
        &nbsp;
        <button onClick={onEdit}>✏️</button>
        &nbsp;
        <button onClick={onCreateProfile}>🧲</button>
        &nbsp;
      </NodeToolbar>
      <NodeToolbar position={Position.Right} className="flex gap-2 entity-node-toolbar" >
        <Handle type="source" position={Position.Right}>🔗</Handle>
      </NodeToolbar>
      <NodeToolbar position={Position.Bottom} className="flex gap-2 entity-node-toolbar" >
        <button onClick={onHide}>🕶</button>
        &nbsp;
        <button onClick={onDelete}>🗑</button>
        &nbsp;
      </NodeToolbar>
    </>
  )
}

export const EntityNodeName = "entity-node";
