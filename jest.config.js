export default {
  transform: {},
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**.js', '!**/tests/**', '!/node_modules'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'html'],
  testMatch: ['**/tests/*.(test|spec|jest).js'],
  testPathIgnorePatterns: ['tests/(setup|testUtils).js'],
  verbose: true,
  testEnvironment: 'jsdom',
};
