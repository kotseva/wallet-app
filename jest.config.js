module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: [],
  collectCoverageFrom: [
    'utils/**/*.ts',
    'services/**/*.ts',
    '!**/*.d.ts',
  ],
};
