import { layoutGraph } from './graph-layout';
const scope = self as unknown as {
  onmessage:
    | ((
        e: MessageEvent<{
          nodes: { id: string }[];
          links: { sourceId: string; targetId: string }[];
        }>,
      ) => void)
    | null;
  postMessage: (v: unknown) => void;
};
scope.onmessage = (e) => {
  scope.postMessage(layoutGraph(e.data.nodes, e.data.links));
};
