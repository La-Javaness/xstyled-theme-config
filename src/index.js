export default {
	withXstyledThemeWebpack: (themeName) => {
		return (config) => {
			const xtConfig = {
				...config,
			}

			xtConfig.module = config.module || {}
			xtConfig.module.rules = config.module.rules || []
			xtConfig.module.rules.push({
				test: new RegExp(`${themeName}/.*.ts$`),
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: false,
							configFile: false,
							presets: ['@babel/preset-env', '@babel/preset-typescript'],
							sourceMaps: process.env.NODE_ENV !== 'production',
							inputSourceMap: process.env.NODE_ENV !== 'production',
							cacheDirectory: true,
							// https://github.com/facebook/create-react-app/issues/6846 explains why
							cacheCompression: false,
							compact: process.env.NODE_ENV === 'production',
						},
					},
				],
			})

			xtConfig.resolve = config.resolve || {}
			xtConfig.resolve.alias = {
				...(config.resolve.alias || {}),
				'~theme': `${themeName}/dist`,
			}

			return xtConfig
		}
	},

	withXstyledThemeJest: (themeName) => {
		return (config) => {
			const xtConfig = {
				...config,
			}

			xtConfig.moduleNameMapper = {
				...(config.moduleNameMapper || {}),
				'^~theme/(.*)': `<rootDir>/node_modules/${themeName}/dist/$1`,
			}

			return xtConfig
		}
	},
}
