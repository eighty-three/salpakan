module.exports = {
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@authMiddleware/(.*)$': '<rootDir>/src/authMiddleware/$1'
  },
  moduleDirectories: ['src', 'node_modules'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/src/utils/*.ts',
    '<rootDir>/src/index.ts',
    '<rootDir>/src/app.ts'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/utils/*.ts',
    '!<rootDir>/src/index.ts',
    '!<rootDir>/src/app.ts',
    '!<rootDir>/src/router.ts',
    '!<rootDir>/src/*/*Router.ts',
    '!<rootDir>/src/*/*.schema.ts'
  ]
};
