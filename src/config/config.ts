import { FileItemsOrder } from "./types";

/**
 * Returns the configuration value for specified key (if it exists),
 * preferring value set in workspace config over global config.
 */
const get = (key: string) => {
  const workspaceValue = nova.workspace.config.get(key);
  return workspaceValue !== null ? workspaceValue : nova.config.get(key);
};

interface Config {
  fileItemsOrder: FileItemsOrder;
}

export const config: Config = {
  fileItemsOrder: get("files.initial-order") as FileItemsOrder,
};
