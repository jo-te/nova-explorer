# Explorer.novaextension
Welcome to the repository of the `Explorer` Nova extension.
The actual extension and its [README](./Explorer.novaextension/README.md) can be found only one directory away in [`Explorer.novaextension`](./Explorer.novaextension).

## Development
Development takes place in [`src`](./src) folder using `TypeScript`.
The primary goal was to use `TypeScript` only for better IDE support and even more important to reduce potential error sources drastically but still produce readable clean `JavaScript` extension code to allow users verify its integrity easily.
Therefore no minification or transpiling takes place.
Despite of module importing/exporting the code gets written as if it was consumed directly by Nova.
Still `TypeScript` doesn't produce the most clean and simplest `CommonJS` module code (or I didn't find the best configuration option(s) yet) so the goal couldn't be fully achieved.
The `watch` script will compile the `.ts` source files on every change resulting in a reload of the extension.

## Future development ideas
- [ ] Allow `undo`/`redo` for actions invoked from Files sidebar (Rename, Delete, ...)
- [ ] Add configuration option to hide specific file types
- [ ] Add another sidebar section displaying files related to open editors and also which are unsaved
- [ ] Allow to pin files
- [ ] Move translations into `ts`-files and generate before publish related `strings.json` files
- [ ] Display git status like modified or added

## General Todos
- [ ] Add documental comments
- [ ] Add tests