module.exports = {
	hooks: {
		'pre-commit': 'yarn prettier && yarn test:ci',
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
	},
}
