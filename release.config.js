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
		[
			'@semantic-release/git',
			{
				assets: ['build/*', 'CHANGELOG.md', 'package.json', 'yarn.lock'],
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
		[
			'@saithodev/semantic-release-backmerge',
			{
				branchName: 'develop',
			},
		],
	],
	repositoryUrl: 'git@github.com:La-Javaness/xstyled-theme-config.git',
}
