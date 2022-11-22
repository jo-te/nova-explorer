import { localize } from "../localization/localize";
import { isValidFileOrDirName } from "../utils/helpers";

export const renameFileOrDir = (
  path: string,
  providedCurrentName?: string,
  providedInitialValue?: string
): Promise<string | false> => {
  const currentName = providedCurrentName || nova.path.basename(path);
  const initialValue = providedInitialValue || currentName;

  const inputMsg = localize("msg.renameFileOrDir", {
    FILE_OR_DIR_NAME: currentName,
  });
  return new Promise((resolve) => {
    nova.workspace.showInputPanel(
      inputMsg,
      { value: initialValue },
      (value) => {
        if (typeof value === "string") {
          // Input panel was not canceled

          if (value.length < 1) {
            nova.workspace.showErrorMessage(
              localize("error.newFileOrDirNameMayNotBeEmpty")
            );
            return resolve(renameFileOrDir(path, currentName));
          } else if (value === currentName) {
            return resolve(false);
          } else if (isValidFileOrDirName(value)) {
            if (!hasFileOrDirStillStats(path)) {
              return resolve(false);
            }
            const newPath = path.slice(0, -currentName.length) + value;
            if (
              // Check if value is just current name with different upper and lower case since Nova returns stats independent of upper and lower case
              currentName.toLowerCase() !== value.toLowerCase() &&
              hasFileOrDirAlreadyStats(newPath, value)
            ) {
              return resolve(false);
            } else {
              nova.fs.move(path, newPath);
              return resolve(newPath);
            }
          } else {
            nova.workspace.showErrorMessage(
              localize("error.valueIsNotValidName", {
                VALUE: value,
              })
            );
            return resolve(renameFileOrDir(path, currentName, value));
          }
        }
        return resolve(false);
      }
    );
  });
};

export const hasFileOrDirStillStats = (path: string) => {
  const stats = nova.fs.stat(path);
  if (!stats) {
    nova.workspace.showErrorMessage(localize("error.elementWasMovedOrDeleted"));
    return false;
  }
  return stats;
};

export const hasFileOrDirAlreadyStats = (
  path: string,
  fileOrDirName: string
) => {
  const stats = nova.fs.stat(path);
  if (stats) {
    nova.workspace.showErrorMessage(
      localize("error.elementWithNameExistsAlready", { VALUE: fileOrDirName })
    );
    return stats;
  }
  return false;
};

export const deleteFileOrDir = (
  path: string,
  providedCurrentName?: string
): Promise<boolean> => {
  const currentName = providedCurrentName || nova.path.basename(path);

  return new Promise((resolve) => {
    nova.workspace.showActionPanel(
      localize("msg.reallyDeleteFileOrDir", { FILE_OR_DIR_NAME: currentName }),
      {
        buttons: [localize("Cancel"), localize("Delete")],
      },
      (buttonIndex) => {
        if (buttonIndex && buttonIndex === 1) {
          const stats = hasFileOrDirStillStats(path);
          if (!stats) {
            return resolve(false);
          }
          if (stats.isDirectory()) {
            nova.fs.rmdir(path);
            return resolve(true);
          } else if (stats.isFile()) {
            nova.fs.remove(path);
            return resolve(true);
          }
        }
        return resolve(false);
      }
    );
  });
};

export const createFileOrDir = (
  basePath: string,
  type: "FILE" | "DIR",
  providedInitialValue?: string
): Promise<string | false> => {
  const inputMsg =
    type === "DIR"
      ? localize("msg.nameOfNewFolder")
      : localize("msg.nameOfNewFile");
  const initialValue =
    providedInitialValue ||
    (type === "DIR" ? localize("Unnamed folder") : localize("Unnamed file"));

  return new Promise((resolve) => {
    nova.workspace.showInputPanel(
      inputMsg,
      { value: initialValue },
      (value) => {
        if (typeof value === "string") {
          // Input panel was not canceled

          if (value.length < 1) {
            nova.workspace.showErrorMessage(
              localize("error.newFileOrDirNameMayNotBeEmpty")
            );
            return resolve(createFileOrDir(basePath, type));
          } else if (isValidFileOrDirName(value)) {
            const pathOfNewFileOrDir = `${basePath}/${value}`;
            if (hasFileOrDirAlreadyStats(pathOfNewFileOrDir, value)) {
              return resolve(false);
            } else {
              if (type === "DIR") {
                nova.fs.mkdir(pathOfNewFileOrDir);
                return resolve(pathOfNewFileOrDir);
              } else if (type === "FILE") {
                const newFile = nova.fs.open(pathOfNewFileOrDir, "x");
                newFile.write("");
                newFile.close();
                return resolve(pathOfNewFileOrDir);
              }
            }
          } else {
            // Provided value was not valid, try again
            nova.workspace.showErrorMessage(
              localize("error.valueIsNotValidName", {
                VALUE: value,
              })
            );
            return resolve(createFileOrDir(basePath, type, value));
          }
        }
        return resolve(false);
      }
    );
  });
};
