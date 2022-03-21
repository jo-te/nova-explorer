import { switchFileItemsOrder } from "./actions/configActions";
import {
  createFileOrDir,
  deleteFileOrDir,
  renameFileOrDir,
} from "./actions/fileAndDirActions";
import {
  FILES_RENAME_CMD,
  FILES_DOUBLE_CLICK_CMD,
  FILES_OPEN_CMD,
  FILES_DELETE_CMD,
  FILES_NEW_FOLDER_CMD,
  FILES_NEW_FILE_CMD,
  FILES_RELOAD_CMD,
  FILES_SHOW_IN_FINDER_CMD,
  FILES_SWITCH_ORDER_CMD,
} from "./commands";
import { FilesDataProvider } from "./FilesDataProvider";
import { localize } from "./localization/localize";

function activate() {
  // Do work when the extension is activated

  // Create the TreeView
  const workspaceDir = nova.workspace.path;
  if (!workspaceDir) {
    return;
  }

  const filesDataProvider = new FilesDataProvider(workspaceDir);
  const treeView = new TreeView("files", {
    dataProvider: filesDataProvider,
  });

  // treeView.onDidChangeSelection((selection) => {
  // });

  treeView.onDidExpandElement((element) => {
    element.isExpanded = true;
  });

  treeView.onDidCollapseElement((element) => {
    element.isExpanded = false;
  });

  // treeView.onDidChangeVisibility(() => {
  // });

  // TreeView implements the Disposable interface
  nova.subscriptions.add(treeView);

  // Null as pattern to watch everything in workspace directory
  const fileSystemWatcher = nova.fs.watch(null, (path) => {
    if (!treeView || !filesDataProvider) {
      return;
    }
    const fileStats = nova.fs.stat(path);
    if (fileStats) {
      // File was added or modified
      const parentElement = filesDataProvider.discoverPath(path);
      if (parentElement) {
        const elementToReload =
          parentElement.path === workspaceDir ? null : parentElement;
        treeView.reload(elementToReload);
      }
    } else {
      // File was deleted

      if (filesDataProvider.clearElementForPath(path)) {
        // Related element was existent and got cleared

        const parentPath = nova.path.dirname(path);
        const parentElement = filesDataProvider.getElementForPath(parentPath);
        if (parentElement) {
          const elementToReload =
            parentElement.path === workspaceDir ? null : parentElement;
          treeView.reload(elementToReload);
        }
      }
    }
  });
  // FileWatcher implements the Disposable interface
  nova.subscriptions.add(fileSystemWatcher);

  const hasTreeViewSelection = () => {
    return (
      treeView.selection.length > 0 &&
      // Nova keeps items that got actually deleted in meantime in treeView.selection
      // (as long as nothing new gets selected and even so we call reload) therefor we
      // check if selection is maybe obsolete and not visible to the user (thereby actually empty)
      treeView.selection.some((item) =>
        filesDataProvider.hasElementForPath(item.path)
      )
    );
  };

  nova.commands.register(FILES_SHOW_IN_FINDER_CMD, () => {
    treeView.selection.forEach((element) => {
      nova.fs.reveal(element.path);
    });
  });

  const openSelection = () => {
    treeView.selection.forEach((element) => {
      if (!element.isDir()) {
        nova.workspace.openFile(element.path);
      }
    });
  };
  nova.commands.register(FILES_DOUBLE_CLICK_CMD, openSelection);
  nova.commands.register(FILES_OPEN_CMD, openSelection);

  const revealFileOrDirAtPath = (
    fileOrDirPath: string,
    reloadFirst = false
  ) => {
    const parentPath = nova.path.dirname(fileOrDirPath);
    if (!filesDataProvider.hasElementForPath(fileOrDirPath)) {
      filesDataProvider.initChildElementsForPath(parentPath);
    }
    const newFileOrDirElement =
      filesDataProvider.getElementForPath(fileOrDirPath);
    const parentElement = filesDataProvider.getElementForPath(parentPath);

    if (newFileOrDirElement && parentElement) {
      if (reloadFirst) {
        const elementToReload =
          parentElement.path === workspaceDir ? null : parentElement;
        treeView
          .reload(elementToReload)
          .then(() => treeView.reveal(newFileOrDirElement));
      } else {
        treeView.reveal(newFileOrDirElement);
      }
    }
  };

  nova.commands.register(FILES_RENAME_CMD, () => {
    const selection = treeView.selection;
    const selectionCount = treeView.selection.length;
    if (selectionCount < 1) {
      return;
    } else if (selectionCount === 1) {
      const fileOrDirItem = selection[0];
      renameFileOrDir(fileOrDirItem.path, fileOrDirItem.name).then(
        (newFileOrDirPath) => {
          if (newFileOrDirPath) {
            // Clear element for old path
            filesDataProvider.clearElementForPath(fileOrDirItem.path);
            revealFileOrDirAtPath(newFileOrDirPath, true);
          }
        }
      );
    } else {
      nova.workspace.showInformativeMessage(
        localize("info.multipleRenamingNotPossible")
      );
    }
  });

  nova.commands.register(FILES_DELETE_CMD, () => {
    treeView.selection.forEach((element) => {
      deleteFileOrDir(element.path, element.name).then((wasDeleted) => {
        if (wasDeleted && filesDataProvider.clearElementForPath(element.path)) {
          const parentPath = nova.path.dirname(element.path);
          const elementToReload =
            parentPath === workspaceDir
              ? null
              : filesDataProvider.getElementForPath(parentPath);
          treeView.reload(elementToReload);
        }
      });
    });
  });

  const createFileOrDirAndReveal = (basePath: string, type: "FILE" | "DIR") => {
    createFileOrDir(basePath, type).then((newFileOrDirPath) => {
      if (newFileOrDirPath) {
        revealFileOrDirAtPath(newFileOrDirPath, true);
      }
    });
  };
  const createFileOrDirInSelection = (type: "FILE" | "DIR") => {
    const selection = treeView.selection;
    const selectionCount = treeView.selection.length;
    if (!hasTreeViewSelection()) {
      createFileOrDirAndReveal(workspaceDir, type);
    } else if (selectionCount === 1) {
      const fileOrDirItem = selection[0];
      const fileOrDirStats = nova.fs.stat(fileOrDirItem.path);
      if (fileOrDirStats) {
        if (fileOrDirStats.isDirectory()) {
          createFileOrDirAndReveal(fileOrDirItem.path, type);
        } else {
          const parentPath = nova.path.dirname(fileOrDirItem.path);
          createFileOrDirAndReveal(parentPath, type);
        }
      }
    } else {
      nova.workspace.showInformativeMessage(
        localize("info.fileOrDirCreationNotPossibleWithMultiSelection")
      );
    }
  };
  nova.commands.register(FILES_NEW_FOLDER_CMD, () => {
    createFileOrDirInSelection("DIR");
  });
  nova.commands.register(FILES_NEW_FILE_CMD, () => {
    createFileOrDirInSelection("FILE");
  });

  nova.commands.register(FILES_RELOAD_CMD, () => {
    if (!hasTreeViewSelection()) {
      const element = filesDataProvider.getElementForPath(workspaceDir);
      if (element) {
        filesDataProvider.initChildElements(element);
        treeView.reload();
      }
    } else {
      let reloadPromise = Promise.resolve();
      treeView.selection.forEach((element) => {
        if (element.isDir()) {
          filesDataProvider.initChildElements(element);
          reloadPromise = reloadPromise.then(() => treeView.reload(element));
        }
      });
      if (treeView.selection.length === 1) {
        reloadPromise.then(() => treeView.reveal(treeView.selection[0]));
      }
    }
  });

  nova.commands.register(FILES_SWITCH_ORDER_CMD, () => {
    switchFileItemsOrder();
    const element = filesDataProvider.getElementForPath(workspaceDir);
    if (element) {
      filesDataProvider.initChildElements(element);
      treeView.reload();
    }
  });
}

function deactivate() {
  // Clean up state before the extension is deactivated
}

export = {
  activate,
  deactivate,
};
