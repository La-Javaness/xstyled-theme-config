import path from 'path'

export default {
	withXstyledThemeWebpack: (themeName, userOptions = {}) => {
		return (config) => {
			const defaultOptions = {
				externals: false,
				projectDir: './',
				forceLocalStyledComponents: !userOptions.externals,
			}

			const options = {
				...defaultOptions,
				...userOptions,
			}

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

			// Styled components specifically causes many invalid React hook errors if
			// we don't make sure it's loaded in a single place. Because of how many
			// dependencies load up styled-components, we propose to hardcode its resolution.
			if (options.forceLocalStyledComponents) {
				xtConfig.resolve.alias['styled-components'] = path.resolve(
					path.join(options.projectDir, 'node_modules', 'styled-components')
				)
			}

			// General version of the above hardcode, forces to prefer the project's
			// modules directory instead of those in a dependency's own node_modules.
			// This is useful when you're developing and linking various local packages
			// as part of your development process.
			if (!options.externals) {
				xtConfig.resolve.modules = [
					...xtConfig.resolve.modules,
					path.resolve(options.projectDir, 'node_modules'),
					'node_modules',
				]
			}

			if (options.externals) {
				xtConfig.externals = [
					...(Array.isArray(config.externals) ? config.externals : [config.externals || false]),
					{
						react: 'react',
						'react-dom': 'react-dom',
						'styled-components': 'styled-components',
						'@xstyled/core': '@xstyled/core',
						'@xstyled/styled-components': '@xstyled/styled-components',
						'@xstyled/system': '@xstyled/system',
						'@xstyled-theme/system': '@xstyled-theme/system',
					},
					(context, request, callback) => {
						if (request.startsWith('~theme')) {
							return callback(null, request)
						}
						return callback()
					},
				].filter(Boolean)
			}

			return xtConfig
		}
	},

	withXstyledThemeJest: (
		themeName,
		options = {
			modulesToTransform: [],
		}
	) => {
		return (config) => {
			const xtConfig = {
				...config,
			}

			xtConfig.moduleNameMapper = {
				...(config.moduleNameMapper || {}),
				'^~theme/(.*)': `<rootDir>/node_modules/${themeName}/dist/$1`,
			}

			xtConfig.transformIgnorePatterns = (xtConfig.transformIgnorePatterns || []).filter(
				(pattern) =>
					![
						'<rootDir>/node_modules/',
						'<rootDir>/node_modules',
						'/node_modules/',
						'/node_modules',
						'node_modules/',
						'node_modules',
						'[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
					].includes(pattern)
			)

			const modulesToTransform = [...options.modulesToTransform, themeName]
			xtConfig.transformIgnorePatterns.push(`<rootDir>/node_modules/(?!${modulesToTransform.join('|')})`)

			xtConfig.moduleDirectories = ['<rootDir>/node_modules', '<rootDir>/src', 'node_modules']

			xtConfig.roots.push(`<rootDir>/node_modules/${themeName}/dist`)

			delete xtConfig.modulePaths

			return xtConfig
		}
	},
}
