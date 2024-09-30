import { useCallback, useMemo, useRef, useState } from "react";

import {
  DiagramCallbacks,
  DiagramActions,
} from "./diagram-api";

export interface UseDiagramType {

  isReady: boolean;

  /**
   * Since actions are not available at time of return from,
   * this hook we provide them using getter.
   */
  actions: () => DiagramActions;

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
  const actions = useRef<DiagramActions>(noOperationDiagramActions);
  const getActions = useCallback(() => actions.current, [actions]);

  return useMemo(() => {
    return {
      isReady,
      actions: getActions,
      callbacks,
      registerActionCallback: (handler) => {
        setIsReady(true);
        actions.current = handler;
      },
    };
  }, [isReady, actions, callbacks, setIsReady]);
};

/**
 * No operation implementation of actions.
 */
const noOperationDiagramActions: DiagramActions = {
  getNodes: () => [],
  addNodes: () => { },
  updateNodes: () => { },
  removeNodes: () => { },
  getEdges: () => [],
  addEdges: () => { },
  updateEdges: () => { },
  removeEdges: () => { },
  setContent: async () => { },
  setViewportToPosition: () => { },
  centerViewportToNode: () => { },
};
