const baseWebpackFile = require('./.dotfiles/webpack.config')

module.exports = async (webpackEnv) => {
	const baseConfig = baseWebpackFile(webpackEnv)

	const config = {
		...baseConfig,
		node: {
			global: true,
		},
	}

	return config
}
