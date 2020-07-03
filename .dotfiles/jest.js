const fs = require('fs')
const path = require('path')

module.exports = {
	roots: ['<rootDir>/src'],
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
	coverageReporters: ['json', 'lcov', 'text'],
	setupFilesAfterEnv: [
		'jest-extended',
		...['<rootDir>/src/setupTestsShared.js', '<rootDir>/src/setupTests.js'].filter(setupFile =>
			fs.existsSync(setupFile.replace('<rootDir>', path.resolve(__dirname, '../')))
		),
	],
	testEnvironment: 'jest-environment-jsdom-sixteen',
	testMatch: ['**/__tests__/**/*.test.(js|ts|jsx|tsx)', '**/?(*.)+(spec|test).(js|ts|jsx|tsx)'],
	transform: {
		'^.+\\.(js|ts)x?$': 'babel-jest',
		'^.+\\.css$': '<rootDir>/.dotfiles/jest/cssTransform.js',
		'^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/.dotfiles/jest/fileTransform.js',
	},
  transformIgnorePatterns: [
		'<rootDir>/node_modules/',
		'^.+\\.module\\.(css|sass|scss)$'
	],
	modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
	moduleNameMapper: {
		'^react-native$': 'react-native-web',
		'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
	},
	moduleFileExtensions: ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}
