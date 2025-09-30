import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const base = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_app.*',
    '!src/**/_document.*'
  ],
  coverageDirectory: 'coverage'
};

export default createJestConfig({
  ...base,
  projects: [
    { displayName: 'unit', testMatch: ['<rootDir>/src/**/__tests__/**/*.(spec|test).{js,jsx,ts,tsx}'] },
    { displayName: 'integration', testMatch: ['<rootDir>/tests/integration/**/*.(spec|test).{js,jsx,ts,tsx}'] }
  ]
});
