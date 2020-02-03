/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/camelcase */
'use strict';
const path = require('path');
const fs = require('fs').promises;
const argv = require('minimist')(process.argv.slice(2));
const gitParse = require('git-url-parse');

async function copyReadme(docsDir) {
  await fs.copyFile(path.join(process.cwd(), 'README.md'), path.join(docsDir, 'Home.md'));
}

async function deploy(docsDir) {
  try {
    await fs.access(docsDir);
  } catch (err) {
    if (argv.v || argv.verbose) console.warn(err);
    return;
  }
  if (!process.env.GITHUB_ACTOR)
    throw new Error('You must specify an actor whom performs the commit using GITHUB_ACTOR env variable');
  if (!process.env.GITHUB_TOKEN)
    throw new Error('You must specify a token authenticating the commit using GITHUB_TOKEN env variable');

  const metadata = require(path.resolve(process.cwd(), 'package.json'));
  const git = require('simple-git/promise')();
  const remotes = await git.getRemotes(true);
  const origin = (remotes.find(remote => remote.name === 'origin') || remotes[0]).refs.push;
  const { resource, full_name } = gitParse(origin);
  const url = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@${resource}/${full_name}.wiki.git`;
  const message = `chore(release): v${metadata.version} documentation`;
  try {
    await git.silent(true).raw(['ls-remote', url]);
  } catch (err) {
    if (argv.v || argv.verbose) console.warn(err);
    return;
  }
  await copyReadme(docsDir);
  await git.cwd(docsDir);
  await git.init();
  await git.add('*');
  await git.commit(message);
  await git.push(url, 'master', { '--force': true });
  return { name: full_name, message };
}

deploy(argv._.length ? path.resolve(argv._[0]) : path.resolve(process.cwd(), 'dist', 'docs'))
  .then(status => {
    if (status) console.log(`\n\x1b[36mDeploying "${status.message}" to wiki for repo ${status.name}\x1b[0m\n`);
    else
      console.warn(
        `\n\x1b[33mNo documentation, wiki repository missing or insufficient rights, skipping deploy\x1b[0m\n`,
      );
  })
  .catch(err => {
    if (argv.v || argv.verbose) console.error(err);
    console.warn(`\n\x1b[31mFailed to deploy to wiki repo\x1b[0m\n`);
    process.exit(1);
  });
