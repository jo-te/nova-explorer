# Release workflow
This document describes the workflow for releasing a new extension version.<br>
It currently involves some manual steps which maybe could theoretically be automated.

## Steps
1. Run `npm run prepareRelease`.
2. Change version in `extension.json` to new version.
3. Update **Next** in `CHANGELOG.md` to `"Version <new version>"`.
4. Commit new changes with `"Prepare release of v<new version>"`. *(This is only a message proposal)*
5. Create a Git tag with new version: `git tag -a v<new version> -m "Release v<new version>"`.<br>
   *Note:* A GitHub workflow is set up which will automatically create a new GitHub release with the build extension as an asset.
6. Push everything to remote repository (hosted at GitHub) including new tag: `git push && git push origin v<new version>`.
7. Publish extension via Nova menu.
