import { useMemo, useState } from "react";

import {
  DiagramCallbacks,
  DiagramActions,
} from "./diagram-api";

export interface UseDiagramType {

  isReady: boolean;

  actions: DiagramActions;

  callbacks: DiagramCallbacks;

  registerActionCallback: (handler: DiagramActions) => void;

}

/**
 * This acts like a interface, where the diagram retrieves the
 * callbacks and registers for handling the actions.
 *
 * The actions must not be used before they are ready!
 */
export const useDiagram = (callbacks: DiagramCallbacks): UseDiagramType => {
  const [isReady, setIsReady] = useState(false);
  const [actions, setActions] = useState<DiagramActions>(noOperationDiagramActions);

  return useMemo(() => {
    return {
      isReady,
      actions,
      callbacks,
      registerActionCallback: (handler) => {
        setIsReady(true);
        setActions(handler);
      },
    };
  }, [isReady, actions, callbacks, setIsReady, setActions]);
};

/**
 * No operation implementation of actions.
 */
const noOperationDiagramActions: DiagramActions = {
  getNodes: () => [],
  setNode: () => { },
  removeNode: () => { },
  getEdges: () => [],
  setEdge: () => { },
  removeEdge: () => { },
  setContent: async () => { },
  setViewToPosition: () => { },
  focusNode: () => { },
};
