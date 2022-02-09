import { TEMPLATE_VARS } from "./templateVars";

const build = <
  UsedTemplateVars extends readonly (keyof typeof TEMPLATE_VARS)[]
>(
  value: string,
  usedVars: UsedTemplateVars
) => {
  return {
    value,
    usedVars: usedVars,
  } as const;
};

export const L10N_DICT = {
  Cancel: build("Cancel", []),
  Delete: build("Delete", []),
  "Unnamed folder": build("Unnamed folder", []),
  "Unnamed file": build("Unnamed file", []),
  "info.multipleRenamingNotPossible": build(
    "Renaming multiple objects at the same time is currently not possible.",
    []
  ),
  "info.fileOrDirCreationNotPossibleWithMultiSelection": build(
    "Creating files or folders is currently not possible when multiple items are selected.",
    []
  ),
  "error.newFileOrDirNameMayNotBeEmpty": build(
    "New name may not be empty.",
    []
  ),
  "error.valueIsNotValidName": build(
    `"${TEMPLATE_VARS.VALUE}" is not a valid name.`,
    ["VALUE"] as const
  ),
  "error.elementWasMovedOrDeleted": build(
    "Element was moved or deleted in meantime.",
    []
  ),
  "error.elementWithNameExistsAlready": build(
    `Element with name "${TEMPLATE_VARS.VALUE}" exists already. Please delete first or choose another name.`,
    ["VALUE"] as const
  ),
  "msg.renameFileOrDir": build(`Rename "${TEMPLATE_VARS.FILE_OR_DIR_NAME}"`, [
    "FILE_OR_DIR_NAME",
  ] as const),
  "msg.reallyDeleteFileOrDir": build(
    `Shall "${TEMPLATE_VARS.FILE_OR_DIR_NAME}" really be deleten irreversibly?`,
    ["FILE_OR_DIR_NAME"] as const
  ),
  "msg.nameOfNewFolder": build("Name of new folder", []),
  "msg.nameOfNewFile": build("Name of new file", []),
} as const;
