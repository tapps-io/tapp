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

| Type                                                            | [Scope]           | [ID]           | Subject  | [Flags]       |
| --------------------------------------------------------------- | ----------------- | -------------- | -------- | ------------- |
| feat, fix, perf, revert, docs, style, refactor, test, build, ci | optional `string` | #123 or ID-123 | `string` | repo specific |

Now you are ready to build with ❤!

## Updating

Run the following commands to update the starter kit when a new version is released.

```bash
git fetch tapp
git merge tapp/master --no-commit --no-ff
npm install
```

## Publishing

Default behavior is to publish packages to the private package feed configured in the `.npmrc` file. Before publishing, make sure to change the package `"name"` inside the `package.json` file, as well as removing the `"private": true` line. Versioning should respect the following rules:

```bash
npm run release
```

This will generate run the tests, build the package, generate a changelog from commits, git tag the release and finally push it to the repository. Semantic release is used so breaking changes result in a major versioning update, features in a minor, and fixes in patches.

| Version | Change                                                                         |
| ------- | ------------------------------------------------------------------------------ |
| `X.1.1` | **Major:** changes to event communication or breaking functionality            |
| `1.X.1` | **Minor:** changes that adds functionality, but still are backwards compatible |
| `1.1.X` | **Patch:** changes fixing bugs without functionality additions                 |

For more info read [Semantic Versioning](https://semver.org/).

## Browsers support

This tiny app aims to support the following configuration [browserl.ist](https://browserl.ist/?q=%3E+0.5%25%2C+last+2+versions%2C+not+dead%2C+Firefox+ESR%2C+Chrome+41%2C+IE+10).

| ![IE / Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![iOS Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png) | ![Samsung](https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Opera Mini](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera-mini/opera-mini_48x48.png) |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| IE10, IE11, Edge                                                                                   | last 2 versions                                                                                        | last 2 versions                                                                                     | last 2 versions                                                                                     | last 2 versions                                                                                                 | last 2 versions                                                                                                          | last 2 versions                                                                                  | last 2 versions                                                                                                 |
