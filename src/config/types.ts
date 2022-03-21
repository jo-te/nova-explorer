export const FILE_ITEMS_ORDER_OPTIONS = [
  "Independent of type",
  "Folders first",
  "Files first",
] as const;
export type FileItemsOrder = typeof FILE_ITEMS_ORDER_OPTIONS[number];
