module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(scss|css|less)$': '<rootDir>/tests/styleMock.js',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  roots: ['<rootDir>/src'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { configFile: './tests/babel.config.js' }]
  },
};
