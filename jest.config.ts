import { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '@backend/(.*)': '<rootDir>/apps/backend/src/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  rootDir: '.',
  roots: ['<rootDir>/apps/'],
};

export default config;
