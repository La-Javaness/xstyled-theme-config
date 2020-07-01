/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const baseWebpackFile = require('./.dotfiles/webpack.config')

module.exports = async (webpackEnv) => {
	const baseConfig = baseWebpackFile(webpackEnv)

	const config = {
		...baseConfig,

		// Add your edits here
	}

	return config
}
