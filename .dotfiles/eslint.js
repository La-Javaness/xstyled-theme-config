module.exports = {
	parserOptions: {
		ecmaVersion: 2019,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	rules: {
		radix: ['error', 'as-needed'],
		'no-console': [1, { allow: ['error', 'info'] }],
		strict: ['error', 'global'],
		'no-plusplus': 0,
		'no-underscore-dangle': 0,
		'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
	},
	overrides: [
		{
			files: ['**/*.test.js'],
			env: { jest: true },
			plugins: ['jest'],
			rules: {
				'jest/no-disabled-tests': 'warn',
				'jest/no-focused-tests': 'error',
				'jest/no-identical-title': 'error',
				'jest/prefer-to-have-length': 'warn',
				'jest/valid-expect': 'error',
			},
		},
    {
      files: ['cypress/**/*.specs.js'],
      globals: {
        context: true,
        before: true,
        cy: true,
        Cypress: true,
        expect: true,
        assert: true,
      },
    },
	],
}
