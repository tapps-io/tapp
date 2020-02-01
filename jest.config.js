module.exports = {
  roots: ['<rootDir>/src'],
  setupFiles: ['jest-date-mock', './jest.globals.js'],
  globals: {
    hook: 'hook_0-0-0',
    weakHook: 'hook',
    isDevServer: false,
  },
  transform: {
    '^.+\\.(js|ts)x?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tools/file-transformer-jest.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!@trutoo)'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
};
