![Continuous Delivery](../../workflows/Continuous%20Delivery/badge.svg)

# Tiny app | Tapp

This is a tiny app template used for micro-architecture on client side.

## Documentation

Every release of a tiny app generates code documentation and publishes it to the [repositories wiki](../../wiki) found in the tabs above.

## Installation & Scripts

To get started with your new tiny app you are going to need [Node](https://nodejs.org/en/) and then follow [this template guide](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) to create new repository from a template.

After creating the new repository attach the template as an upstream remote for syncing updates.

```bash
git remote add tapp git@github.com:tapps-io/tapps-io.tapp.git
```

Finally install all dependencies with:

```bash
npm install
```

Bellow are a list of NPM scripts that you can run to aid development.

| Command           | Description                                                 | CI/CD only |
| ----------------- | ----------------------------------------------------------- | ---------- |
| `npm start`       | Starts a dev server hosting the tiny app                    | no         |
| `npm test`        | Runs [Jest](https://jestjs.io/) tests for quality ensurance | no         |
| `npm run build`   | Compiles the code to the `dist/` folder                     | no         |
| `npm run schema`  | Converts files in `src/schema` to TypeScript interfaces     | no         |
| `npm run release` | [Publishes](#Publishing) the `dist/` to the package feed    | yes        |
| `npm run wiki`    | Publishes the `dist/docs` to the wiki                       | yes        |

Make changes then commit them using:

```bash
git add .
git commit -m "[MESSAGE]" # type(scope): #123 subject #flags
git push
```

| Type                                                                 | [Scope]           | [ID] | Subject  | [Flags]       |
| -------------------------------------------------------------------- | ----------------- | ---- | -------- | ------------- |
| feat, fix, perf, k8s, revert, docs, style, refactor, test, build, ci | optional `string` | #123 | `string` | repo specific |

Now you are ready to build with ❤!

## Updating

Run the following commands to update the starter kit when a new version is released.

```bash
git fetch tapp
git merge tapp/master --no-commit --no-ff
npm install
```

## Publishing

Default behavior is to publish packages to the GitHub repositories package feed configured in the `.npmrc` file. Before publishing, make sure to change the package `"name"` and any other descriptive keys inside the `package.json` file, as well as removing the `"private": true` line. [Semantic release](https://github.com/semantic-release/semantic-release) is used to automatically determine version; breaking changes result in a major versioning update, features in a minor, and fixes/performance in patches. No other types will trigger a release.

| Version | Trigger         | Change    | Application                                                         |
| ------- | --------------- | --------- | ------------------------------------------------------------------- |
| `X.1.1` | BREAKING CHANGE | **Major** | Changes to event communication or breaking functionality            |
| `1.X.1` | feat:           | **Minor** | Changes that adds functionality, but still are backwards compatible |
| `1.1.X` | fix/perf:       | **Patch** | Changes fixing bugs without functionality additions                 |

> For more info read [Semantic Versioning](https://semver.org/).

This command is **intended to be run using a CI/CD pipeline** such as GitHub Actions. It will generate a changelog from commits, git tag the release and finally push it to the repository.

```bash
npm run release
```

## Browsers support

This tiny app aims to support the following configuration [browserl.ist](https://browserl.ist/?q=%3E+0.5%25%2C+last+2+versions%2C+not+dead%2C+Firefox+ESR%2C+Chrome+41%2C+IE+11).

| ![IE / Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![iOS Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png) | ![Samsung](https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Opera Mini](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera-mini/opera-mini_48x48.png) |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                         | last 2 versions                                                                                        | last 2 versions                                                                                     | last 2 versions                                                                                     | last 2 versions                                                                                                 | last 2 versions                                                                                                          | last 2 versions                                                                                  | last 2 versions                                                                                                 |
