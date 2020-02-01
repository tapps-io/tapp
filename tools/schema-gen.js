/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const watch = require('fs').watch;
const path = require('path');
const { compileFromFile } = require('json-schema-to-typescript');
const argv = require('minimist')(process.argv.slice(2));

const schemaDir = argv._.length ? path.resolve(argv._[0]) : path.resolve(process.cwd(), 'src', 'schema');

async function convertFile(dir, file) {
  return compileFromFile(path.join(dir, file), {
    bannerComment:
      '/*\n* DO NOT MODIFY IT BY HAND! This file was automatically generated.\n* Instead, modify the source JSONSchema file,\n* and run "npm run schema" to regenerate this file.\n*/',
    style: { singleQuote: true },
  })
    .then(ts => {
      const tsPath = path.join(dir, file.replace(/\.json$/, '.ts'));
      return fs.writeFile(tsPath, ts).then(() => tsPath);
    })
    .then(tsPath => {
      console.log(
        `\n\x1b[36mConverted JSON schema into TypeScript interface and saved with name [${path.basename(
          tsPath,
        )}]\x1b[0m\n`,
      );
    });
}

async function schemaGen(dir) {
  console.log(`\n\x1b[35mConverting all JSON schemas in [${schemaDir}] to TypeScript interfaces\x1b[0m\n`);
  return fs
    .readdir(dir)
    .then(files => files.filter(file => file.endsWith('.json')))
    .then(files => Promise.all(files.map(file => convertFile(dir, file))));
}

let watchTimeout;
schemaGen(schemaDir)
  .then(() => {
    console.log(`\n\x1b[32mSuccessfully generated TypeScript interfaces from JSON schema\x1b[0m\n`);
  })
  .catch(err => {
    if (argv.v || argv.verbose) console.error(err);
    console.warn(`\n\x1b[31mFailed to generate TypeScript interfaces from JSON schema\x1b[0m\n`);
  })
  .finally(() => {
    if (argv.w || argv.watch) {
      console.log(`\n\x1b[35mStarting watcher for JSON schemas in [${schemaDir}]\x1b[0m\n`);
      watch(schemaDir, (_, file) => {
        if (file.endsWith('.json') && !watchTimeout) {
          watchTimeout = setTimeout(() => {
            watchTimeout = clearTimeout(watchTimeout);
            convertFile(schemaDir, file);
          }, 100);
        }
      });
    }
  });
