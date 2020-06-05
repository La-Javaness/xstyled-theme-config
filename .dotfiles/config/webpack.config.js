const isWsl = require('is-wsl')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')
const resolve = require('resolve')
const webpack = require('webpack')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')

const paths = require('./paths')
const getClientEnvironment = require('./env')

module.exports = function(webpackEnv) {
	const isEnvDevelopment = webpackEnv === 'development'
	const isEnvProduction = webpackEnv === 'production'
	const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile')
	const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true'
	const useTypeScript = false
	const useReact = false

	const env = getClientEnvironment()

	return {
		mode: webpackEnv,
		bail: isEnvProduction,
		entry: paths.appIndexJs,
		output: {
			path: paths.appBuild,
			filename: 'index.js',
			libraryExport: 'default',
			libraryTarget: 'commonjs2',
		},
		devtool: isEnvProduction ? (shouldUseSourceMap ? 'source-map' : false) : 'cheap-module-source-map',
		externals: [webpackNodeExternals(), 'react', 'react-dom', 'styled-components', '@xstyled/core', '@xstyled/styled-components'],
		optimization: {
			minimize: isEnvProduction,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						parse: {
							ecma: 8,
						},
						compress: {
							ecma: 5,
							warnings: false,
							comparisons: false,
							inline: 2,
						},
						mangle: {
							safari10: true,
						},
						keep_classnames: isEnvProductionProfile,
						keep_fnames: isEnvProductionProfile,
						output: {
							ecma: 5,
							comments: false,
							ascii_only: true,
						},
					},
					parallel: !isWsl,
					cache: true,
					sourceMap: shouldUseSourceMap,
				}),
			],
		},

		module: {
			strictExportPresence: true,
			rules: [
				{ parser: { requireEnsure: false } },

				{
					test: /\.(js|mjs|jsx|ts|tsx)$/,
					enforce: 'pre',
					use: [
						{
							options: {
								cache: true,
								formatter: require.resolve('react-dev-utils/eslintFormatter'),
								eslintPath: require.resolve('eslint'),
								resolvePluginsRelativeTo: __dirname,
							},
							loader: require.resolve('eslint-loader'),
						},
					],
					include: paths.appSrc,
				},
				{
					oneOf: [
						useTypeScript
							? {
									test: /\.(ts|tsx)$/,
									include: paths.appSrc,
									exclude: /node_modules/,
									use: [
										{
											loader: require.resolve('ts-loader'),
										},
										useReact && {
											loader: require.resolve('react-docgen-typescript-loader'),
										},
										{
											loader: require.resolve('babel-loader'),
										},
									].filter(Boolean),
							  }
							: null,
						{
							test: /\.(js|mjs|jsx|ts|tsx)$/,
							include: paths.appSrc,
							exclude: /node_modules/,
							loader: require.resolve('babel-loader'),
						},
					].filter(Boolean),
				},
			],
		},

		plugins: [
			isEnvDevelopment &&
				new CircularDependencyPlugin({
					exclude: /node_modules/,
					failOnError: true,
					allowAsyncCycles: false,
					cwd: process.cwd(),
				}),
			new webpack.DefinePlugin(env.stringified),
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			isEnvDevelopment && new CaseSensitivePathsPlugin(),
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			useTypeScript &&
				new ForkTsCheckerWebpackPlugin({
					typescript: resolve.sync('typescript', {
						basedir: paths.appNodeModules,
					}),
					async: isEnvDevelopment,
					useTypescriptIncrementalApi: true,
					checkSyntacticErrors: true,
					resolveModuleNameModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
					resolveTypeReferenceDirectiveModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
					tsconfig: paths.appTsConfig,
					reportFiles: [
						'**',
						'!**/__tests__/**',
						'!**/?(*.)(spec|test).*',
						'!**/src/setupProxy*',
						'!**/src/setupTests*',
					],
					silent: true,
				}),
		].filter(Boolean),

		resolve: {
			alias: {
				'~theme': 'xstyled-theme-linker',
				...(isEnvProductionProfile && {
					'react-dom$': 'react-dom/profiling',
					'scheduler/tracing': 'scheduler/tracing-profiling',
				}),
			},
			extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
			modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules'), 'node_modules'],
			plugins: [PnpWebpackPlugin],
		},
	}
}
