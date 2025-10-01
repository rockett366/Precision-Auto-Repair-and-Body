const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).{js,jsx}',
    '<rootDir>/tests/integration/**/*.(spec|test).{js,jsx}',
  ],

  // coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/_app.*',
    '!src/**/_document.*',
    '!src/**/__tests__/**',
    '!src/test-utils/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  coverageThreshold: {
    //global: { branches: 70, functions: 75, lines: 80, statements: 80 }
  },
});