/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const path = require('path');
const fs = require('fs').promises;
const argv = require('minimist')(process.argv.slice(2));

async function genHome(docsDir, metadata) {
  let files = await fs.readdir(docsDir);
  files = files.filter(file => path.extname(file) === '.md');
  await fs.writeFile(
    path.join(docsDir, 'Home.md'),
    `# Generated documentation for ${metadata.name}
This is a generated file containing wiki references.

## Links
${files.map(file => `[[${path.basename(file, '.md')}]]`).join('  \n')}`,
  );
}

async function deploy(docsDir) {
  const metadata = require(path.resolve(process.cwd(), 'package.json'));
  const git = require('simple-git/promise')();
  const remotes = await git.getRemotes(true);
  const remote = (remotes.find(remote => remote.name === 'origin') || remotes[0]).refs.push + '/wiki';
  const message = `chore(release): v${metadata.version} documentation`;
  try {
    await git.silent(true).raw(['ls-remote', remote]);
  } catch (err) {
    if (argv.v || argv.verbose) console.error(err);
    return;
  }
  await genHome(docsDir, metadata);
  await git.cwd(docsDir);
  await git.init();
  await git.add('*');
  await git.commit(message);
  await git.push(remote, 'master', { '--force': true });
  return { remote, message };
}

deploy(argv._.length ? path.resolve(argv._[0]) : path.resolve(process.cwd(), 'dist', 'docs'))
  .then(status => {
    if (status) console.log(`\n\x1b[36mDeploying "${status.message}" to wiki repo ${status.remote}\x1b[0m\n`);
    else console.warn(`\n\x1b[33mWiki repository does not exist or insufficient rights, skipping deploy\x1b[0m\n`);
  })
  .catch(err => {
    if (argv.v || argv.verbose) console.error(err);
    console.warn(`\n\x1b[31mFailed to deploy to wiki repo\x1b[0m\n`);
  });
