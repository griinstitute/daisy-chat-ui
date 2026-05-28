import { MessageMetadata } from "@langchain/langgraph-sdk/react";
import { StateType } from "@/providers/Stream";

export interface SubgraphInfo {
  isSubgraph: boolean;
  namespace: string;
  name: string | null;
}

interface StreamMetadata {
  langgraph_checkpoint_ns?: string;
  langgraph_path?: string[];
}

const DEFAULT_SUBGRAPH_INFO: SubgraphInfo = {
  isSubgraph: false,
  namespace: "",
  name: null,
};

export function detectSubgraphInfo(
  metadata: MessageMetadata<StateType> | undefined,
): SubgraphInfo {
  const streamMetadataResult = detectFromStreamMetadata(metadata);
  if (streamMetadataResult) return streamMetadataResult;

  const firstSeenStateResult = detectFromFirstSeenState(metadata);
  if (firstSeenStateResult) return firstSeenStateResult;

  return DEFAULT_SUBGRAPH_INFO;
}

function detectFromStreamMetadata(
  metadata: MessageMetadata<StateType> | undefined,
): SubgraphInfo | null {
  if (!metadata?.streamMetadata) return null;

  const streamMeta = metadata.streamMetadata as StreamMetadata;
  const checkpointNamespace = streamMeta.langgraph_checkpoint_ns;
  const path = streamMeta.langgraph_path;

  if (checkpointNamespace && typeof checkpointNamespace === "string") {
    if (checkpointNamespace.startsWith("tools:")) {
      return {
        isSubgraph: true,
        namespace: checkpointNamespace,
        name: "tools",
      };
    }

    if (checkpointNamespace.includes("|")) {
      const parentName = checkpointNamespace.split("|")[0].split(":")[0];
      return {
        isSubgraph: true,
        namespace: checkpointNamespace,
        name: parentName,
      };
    }
  }

  if (Array.isArray(path) && path.length > 2) {
    const subgraphName = path[path.length - 2];
    if (subgraphName && subgraphName !== "__pregel_pull") {
      return {
        isSubgraph: true,
        namespace: checkpointNamespace || subgraphName,
        name: subgraphName,
      };
    }
  }

  return null;
}

function detectFromFirstSeenState(
  metadata: MessageMetadata<StateType> | undefined,
): SubgraphInfo | null {
  if (!metadata?.firstSeenState) return null;

  const {
    checkpoint,
    metadata: stateMetadata,
    parent_checkpoint,
  } = metadata.firstSeenState;

  if (checkpoint?.checkpoint_ns && checkpoint.checkpoint_ns !== "") {
    return {
      isSubgraph: true,
      namespace: checkpoint.checkpoint_ns,
      name: extractNameFromNamespace(checkpoint.checkpoint_ns),
    };
  }

  if (stateMetadata?.parents && Object.keys(stateMetadata.parents).length > 0) {
    const firstParentKey = Object.keys(stateMetadata.parents)[0];
    return {
      isSubgraph: true,
      namespace: firstParentKey,
      name: firstParentKey,
    };
  }

  if (parent_checkpoint?.checkpoint_ns) {
    const currentNamespace = checkpoint?.checkpoint_ns ?? "";
    const parentNamespace = parent_checkpoint.checkpoint_ns;

    if (currentNamespace !== parentNamespace) {
      return {
        isSubgraph: true,
        namespace: currentNamespace,
        name: extractNameFromNamespace(currentNamespace),
      };
    }
  }

  return null;
}

function extractNameFromNamespace(namespace: string): string | null {
  if (!namespace) return null;

  const colonIndex = namespace.indexOf(":");
  if (colonIndex > 0) {
    return namespace.substring(0, colonIndex);
  }

  return namespace;
}
