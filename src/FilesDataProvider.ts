import { FILES_DOUBLE_CLICK_CMD } from "./commands";
import { runtimeConfig, getConfigValue } from "./config/config";
import { FILES_ITEMS_TO_HIDE_CNFG_KEY } from "./config/keys";
import { FileItemsOrder } from "./config/types";
import { FileItem } from "./FileItem";
import { resolvePathImage } from "./resolvePathImage";

const getSortFunction = (orderStrategy: FileItemsOrder) => {
  return (a: FileItem, b: FileItem) => {
    let sortValue = 0;
    const setSortValueForOrderStrategy = (factor = 1) => {
      if (orderStrategy === "Folders first") sortValue = -1 * factor;
      else if (orderStrategy === "Files first") sortValue = 1 * factor;
    };
    const aIsDir = a.isDir();
    const bIsDir = b.isDir();
    if (aIsDir && !bIsDir) {
      setSortValueForOrderStrategy();
    } else if (!aIsDir && bIsDir) {
      setSortValueForOrderStrategy(-1);
    }

    if (sortValue === 0) {
      sortValue = a.name.localeCompare(b.name);
    }

    return sortValue;
  };
};

export class FilesDataProvider implements TreeDataProvider<FileItem> {
  rootPath!: string;
  pathFileItemDict: {
    [key: string]: FileItem | undefined | null;
  } = {};

  constructor(rootPath: string) {
    this.init(rootPath);
  }

  init(rootPath: string) {
    this.pathFileItemDict = {};
    this.rootPath = rootPath;
  }

  #initElementForPath(
    path: string,
    basename: string,
    providedFileStats?: FileStats
  ) {
    const fileStats = providedFileStats || nova.fs.stat(path);
    if (!fileStats) {
      return;
    }
    const element = new FileItem(
      basename,
      path,
      fileStats.isSymbolicLink(),
      fileStats.isDirectory()
    );
    this.pathFileItemDict[path] = element;
    return element;
  }

  initChildElements(element: FileItem, reinitExisting = false) {
    const basenamesToIgnore = (getConfigValue(FILES_ITEMS_TO_HIDE_CNFG_KEY) ||
      []) as string[];
    if (element.isDir()) {
      const pathChildren = nova.fs.listdir(element.path);
      const childElements = pathChildren
        .reduce((result: FileItem[], child) => {
          const shallChildBeIgnored = basenamesToIgnore.includes(child);
          const childPath = element.path + "/" + child;
          const existingChildElement = this.pathFileItemDict[childPath];
          if (existingChildElement) {
            this.initChildElements(existingChildElement, reinitExisting);
            if (shallChildBeIgnored) {
              delete this.pathFileItemDict[childPath];
            }
          }
          if (!shallChildBeIgnored) {
            const childElement =
              existingChildElement && !reinitExisting
                ? existingChildElement
                : this.#initElementForPath(childPath, child);
            if (childElement) {
              result.push(childElement);
            }
          }
          return result;
        }, [])
        .sort(getSortFunction(runtimeConfig.fileItemsOrder));
      element.childPaths = childElements.map((element) => element.path);
      return childElements;
    }
    return null;
  }

  initChildElementsForPath(path: string) {
    const element =
      this.pathFileItemDict[path] ||
      this.#initElementForPath(path, nova.path.basename(path));
    if (element) {
      return this.initChildElements(element);
    }
  }

  getChildElements(element: FileItem) {
    if (element.childPaths) {
      const elements: FileItem[] = [];
      element.childPaths = element.childPaths.filter((path) => {
        const childElement = this.pathFileItemDict[path];
        if (childElement) {
          elements.push(childElement);
          return true;
        } else {
          // Delete obsolete child reference
          return false;
        }
      });
      return elements;
    }
    return element.childPaths;
  }

  clearElementForPath(path: string) {
    const pathElement = this.pathFileItemDict[path];
    if (pathElement) {
      const childPaths = pathElement.childPaths;
      if (childPaths) {
        childPaths.forEach((childPath) => this.clearElementForPath(childPath));
      }
      // Note that reference to current element at parent element is removed on next call of this.getChildElements and not yet
      delete this.pathFileItemDict[path];
      return pathElement;
    }
    return null;
  }

  discoverPath(path: string) {
    if (this.pathFileItemDict[path] !== undefined) {
      // Discovered this path already
      return;
    }
    const parentPath = nova.path.dirname(path);
    const parentElement = this.pathFileItemDict[parentPath];
    if (parentElement && parentElement.childPaths) {
      // Reinit child elements
      this.initChildElements(parentElement);
      return parentElement;
    } else {
      // Mark path as discovered but irrelevant at the moment
      this.pathFileItemDict[path] = null;
    }
  }

  hasElementForPath(path: string) {
    return this.pathFileItemDict[path] ? true : false;
  }

  getElementForPath(path: string) {
    return this.pathFileItemDict[path];
  }

  getChildren(providedElement: FileItem | null) {
    // Requests the children of an element

    const element = providedElement || this.pathFileItemDict[this.rootPath];
    let children: FileItem[] | null | undefined = [];

    if (element && element.isDir()) {
      if (!element.childPaths) {
        children = this.initChildElements(element);
      } else {
        children = this.getChildElements(element);
      }
    } else {
      // First time call for root
      const rootElement = this.#initElementForPath(
        this.rootPath,
        nova.path.basename(this.rootPath)
      );
      if (rootElement) {
        children = this.initChildElements(rootElement);
      }
    }
    return children || [];
  }

  getParent(element: FileItem) {
    // Requests the parent of an element, for use with the reveal() method

    const parentPath = nova.path.dirname(element.path);
    if (parentPath === this.rootPath) {
      // Nova expects no TreeItem for root but null
      return null;
    }
    return this.pathFileItemDict[parentPath] || null;
  }

  getTreeItem(element: FileItem) {
    // Converts an element into its display (TreeItem) representation

    const result = new TreeItem(element.name);
    result.identifier = element.path;
    result.path = element.path;
    if (element.isDir()) {
      result.collapsibleState = element.isExpanded
        ? TreeItemCollapsibleState.Expanded
        : TreeItemCollapsibleState.Collapsed;
    }
    result.image = resolvePathImage(element.path, element.isDir()) || undefined;
    result.contextValue = element.isDir() ? "dir" : "file";
    result.command = FILES_DOUBLE_CLICK_CMD;

    return result;
  }
}
