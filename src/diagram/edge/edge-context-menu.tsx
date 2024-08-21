import { useContext } from "react";

import { ViewportPortal } from "@xyflow/react";

import { DiagramContext } from "../diagram-controller";

import "./edge-context-menu.css";

export interface EdgeContextMenuType {

  x: number;

  y: number;

  edgeIdentifier: string;

  waypointIndex: number | null;

}

/**
 * As we can not render edge menu on a single place, like node menu, we
 * extracted the menu into a separate component.
 */
export function EdgeContextMenu({ value }: { value: EdgeContextMenuType | null }) {
  const context = useContext(DiagramContext);

  // if (value === null) {
  //   return null;
  // }

  return (
    <>
      <ViewportPortal>
        {/* <div style={{ transform: `translate(${value.x}px, ${value.y}px)`, position: "absolute" }}> </div> */}
        Content ..
      </ViewportPortal>


      <div style={{ transform: `translate(${0}px, ${-200}px)`, position: "absolute" }}>
        <ul className="edge-context-menu">
          <li>
            <button onClick={() => console.log("XXXXXXXXXXXXXXXX")}>ℹ</button>
          </li>
          <li>
            <button>✏️</button>
          </li>
          <li>
            <button>🧲</button>
          </li>
          <li>
            <button>🕶</button>
          </li>
          <li>
            <button>🗑</button>
          </li>
        </ul>
      </div>
    </>
  )
};
