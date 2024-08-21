import {
  useState,
  HTMLAttributes,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";

import {
  EdgeChange,
  OnEdgesChange,
  Panel,
  useStore,
  useStoreApi,
  type NodeChange,
  type OnNodesChange,
} from "@xyflow/react";

import "./developer-tools.css";

/**
 * Provides some internal information.
 *
 * https://reactflow.dev/learn/advanced-use/devtools-and-debugging
 */
export function DeveloperTools() {
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(true);

  return (
    <div className="react-flow__devtools">
      <Panel position="top-left">
        <DevToolButton
          setActive={setChangeLoggerActive}
          active={changeLoggerActive}
          title="Toggle Change Logger"
        >
          Change
        </DevToolButton>
        <DevToolButton
          setActive={setViewportLoggerActive}
          active={viewportLoggerActive}
          title="Toggle Viewport Logger"
        >
          Viewport
        </DevToolButton>
      </Panel>
      {changeLoggerActive && <ChangeLogger />}
      {viewportLoggerActive && <ViewportLogger />}
    </div>
  );
}

function DevToolButton({
  active,
  setActive,
  children,
  ...rest
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={active ? "active" : ""}
      {...rest}
    >
      {children}
    </button>
  );
}

function ChangeLogger({ limit = 16 }: {
  color?: string;
  limit?: number;
}) {
  const [changes, setChanges] = useState<(NodeChange | EdgeChange)[]>([]);
  const onChangeIntercepted = useRef(false);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const store = useStoreApi();

  useEffect(() => {
    if (!onNodesChange || !onEdgesChange || onChangeIntercepted.current) {
      return;
    }

    onChangeIntercepted.current = true;
    const userOnNodesChange = onNodesChange;
    const userOnEdgeChange = onEdgesChange;

    // We register custom listeners.
    const onNodesChangeLogger: OnNodesChange = (changes) => {
      userOnNodesChange(changes);
      setChanges((oldChanges) => [...changes, ...oldChanges].slice(0, limit));
    };

    const onEdgesChangeLogger: OnEdgesChange = (changes) => {
      userOnEdgeChange(changes);
      setChanges((oldChanges) => [...changes, ...oldChanges].slice(0, limit));
    };

    store.setState({ onNodesChange: onNodesChangeLogger, onEdgesChange: onEdgesChangeLogger });
  }, [onNodesChange, limit]);

  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title">Change Logger</div>
      {changes.length === 0 ? (
        <>no changes triggered</>
      ) : (
        changes.map((change, index) => (
          <ChangeInfo key={index} change={change} />
        ))
      )}
    </div>
  );
}

function ChangeInfo({ change }: { change: NodeChange | EdgeChange }) {
  const id = "id" in change ? change.id : "-";
  const { type } = change;

  return (
    <div style={{ marginBottom: 4 }}>
      <div>node id: {id}</div>
      <div>
        {type === "add" ? JSON.stringify(change.item, null, 2) : null}
        {type === "dimensions" ? `dimensions: ${change.dimensions?.width} × ${change.dimensions?.height}` : null}
        {type === "position" ? `position: ${change.position?.x.toFixed(1,)}, ${change.position?.y.toFixed(1)}` : null}
        {type === "remove" ? "remove" : null}
        {type === "select" ? (change.selected ? "select" : "unselect") : null}
        {type === "replace" ? JSON.stringify(change.item, null, 2) : null}
      </div>
    </div>
  );
}

function ViewportLogger() {
  const viewport = useStore((state) =>
    `x: ${state.transform[0].toFixed(2)}, y: ${state.transform[1].toFixed(2,)}, zoom: ${state.transform[2].toFixed(2)}`,
  );
  return <Panel position="top-right">{viewport}</Panel>;
}
