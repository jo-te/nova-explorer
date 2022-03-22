import { FILES_INITIAL_ORDER_CNFG_KEY } from "./keys";
import { FileItemsOrder } from "./types";

/**
 * Returns the configuration value for specified key (if it exists),
 * preferring value set in workspace config over global config.
 */
export const getConfigValue = (key: string) => {
  const workspaceValue = nova.workspace.config.get(key);
  return workspaceValue !== null ? workspaceValue : nova.config.get(key);
};

interface RuntimeConfig {
  fileItemsOrder: FileItemsOrder;
}

export const runtimeConfig: RuntimeConfig = {
  fileItemsOrder: getConfigValue(
    FILES_INITIAL_ORDER_CNFG_KEY
  ) as FileItemsOrder,
};
