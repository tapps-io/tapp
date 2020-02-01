/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars */
'use strict';
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    // Fake url-loader
    return `module.exports = ${JSON.stringify(
      `data:asset/${path.extname(filename).replace('.', '')};base64,${Buffer.from(filename).toString('base64')}`,
    )}`;
  },
};
