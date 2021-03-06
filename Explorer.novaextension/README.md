**Explorer** currently provides a custom file browser as sidebar whose only advantage over the built in file browser are its extending file icons.

<!--
🎈 See it in action:
-->

![](https://github.com/jo-te/nova-explorer/blob/main/Explorer.novaextension/Docs/Images/file-browser-screenshot.png?raw=true)

## Features
- Provides additional file icons for better orientation<br>
  *An endings icon reference document can be found at [https://github.com/jo-te/nova-explorer/blob/main/Explorer.novaextension/Docs/endings-icon-references.md](https://github.com/jo-te/nova-explorer/blob/main/Explorer.novaextension/Docs/endings-icon-references.md).*
- Minimal features you expect from a file browser: `Create`, `Open`, `Rename`, `Delete` files
- Also the `Show in Finder` command is included in case you need an actual grown file browser
- Allows to display folders before files or vice versa
- Allows to hide specific files or folders (by exact matching)

### Features you may miss
- Duplicating files
- Filtering files
- Moving files
- Copy paths
- Everything not listed as feature above

## Requirements
**Explorer** is currently only compatible with local working directories.

## Usage
Open it via the sidebar center and move it into the sidebar dock. Voilà it's ready to use.<br>
Double-click on elements to open them.<br>
Right-click on elements to interact with them.<br>
Use the button on the right side of the header of the sidebar to change order of elements.<br>
Use the second button from right to reload all open elements and apply changes of configuration.

### Configuration
See settings of the extension and use the descriptions for guidance.

## Miscellaneous
### Credits
Big thanks goes to [**apexskier**](https://github.com/apexskier) for contributing type definitons (`@types/nova-editor` and also `@types/nova-editor-node`) for Nova's API to the community which made development much easier.

### Icon requests
Currently the provided file icons only cover a small area of frontend development.<br>
Maybe you are missing some important icons for your daily development work. Don't hesitate to request icons via the repository.