module.exports = {
	branches: ['master'],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		[
			'@semantic-release/changelog',
			{
				changelogFile: 'CHANGELOG.md',
			},
		],
		'@semantic-release/npm',
		[
			'@semantic-release/git',
			{
				assets: ['CHANGELOG.md', 'package.json'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		[
			'@semantic-release/github',
			{
				assets: ['build/*', 'package.json', 'yarn.lock'],
			},
		],
	],
	repositoryUrl: 'git@github.com:La-Javaness/xstyled-theme-config.git',
}
