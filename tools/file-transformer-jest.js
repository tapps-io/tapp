/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars */
'use strict';
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    // Fake url-loader
    return `module.exports = ${JSON.stringify(
      `data:asset/${path.extname(filename).replace('.', '')};base64,${Buffer.from(
        path.relative(config.rootDir, filename).replace(/(\\{1,2})/, '/'),
      ).toString('base64')}`,
    )}`;
  },
};
