/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const config: Config = {
  ...createDefaultPreset(),
  setupFilesAfterEnv: ['./jest.setup.ts'],
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^nanoid$': require.resolve('nanoid'),
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  roots: ['test', 'src', 'node_modules'],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/test/', '/.misc/'],
};

export default config;
