module.exports = function(api) {
	api.cache(true)

	return {
		presets: ['@babel/preset-env'].filter(Boolean),
		plugins: ['@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime', 'babel-plugin-styled-components', process.env.NODE_ENV !== 'production' ? 'istanbul' : null].filter(Boolean),
		env: {
			production: {
				plugins: [].filter(Boolean),
			},
		},
	}
}
