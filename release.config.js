module.exports = {
	branches: ['master'],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		'@semantic-release/changelog',
		[
			'@semantic-release/git',
			{
				assets: ['build/*', 'package.json', 'yarn.lock'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		[
			'@semantic-release/github',
			{
				assets: ['build/*', 'package.json', 'yarn.lock'],
			},
		],
		'@semantic-release/npm',
	],
	repositoryUrl: 'git@github.com:La-Javaness/xstyled-theme-config.git',
}
