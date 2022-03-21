import { config } from "../config/config";
import { FILE_ITEMS_ORDER_OPTIONS } from "../config/types";

export const switchFileItemsOrder = () => {
  const currentOrderOption = config.fileItemsOrder;
  const indexOfNextOrderOption =
    (FILE_ITEMS_ORDER_OPTIONS.indexOf(currentOrderOption) + 1) %
    FILE_ITEMS_ORDER_OPTIONS.length;
  config.fileItemsOrder = FILE_ITEMS_ORDER_OPTIONS[indexOfNextOrderOption];
};
