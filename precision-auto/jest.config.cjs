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
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/_app.*',
    '!src/**/_document.*',
  ],
});