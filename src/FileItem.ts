export class FileItem {
  name: string;
  path: string;
  isSymLink: boolean;
  childPaths?: string[] | null;
  isExpanded: boolean | null;

  constructor(
    name: string,
    path: string,
    isSymLink = false,
    isDir = false,
    childPaths?: string[],
    isExpanded = false
  ) {
    this.name = name;
    this.path = path;
    this.isSymLink = isSymLink;
    this.childPaths = isDir ? childPaths : null;
    this.isExpanded = isDir ? isExpanded : null;
  }

  isDir() {
    return this.childPaths !== null;
  }
}
