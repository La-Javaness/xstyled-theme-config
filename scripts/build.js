/* eslint-disable @typescript-eslint/no-var-requires */
process.env.BABEL_ENV = process.env.BABEL_ENV || 'production'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.on('unhandledRejection', (err) => {
	throw err
})

require('../.dotfiles/config/env')

const chalk = require('chalk')
const fs = require('fs-extra')
const webpack = require('webpack')

const configFactory = require('../webpack.config.js')
const paths = require('../.dotfiles/config/paths')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

function copyPublicFolder() {
	if (fs.existsSync(paths.appPublic)) {
		fs.copySync(paths.appPublic, paths.appBuild, {
			dereference: true,
		})
	}
}

function build(config, previousFileSizes) {
	console.log(`Creating an optimized ${process.env.NODE_ENV} build...`)

	const compiler = webpack(config)
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			let messages
			if (err) {
				if (!err.message) {
					return reject(err)
				}

				messages = formatWebpackMessages({
					errors: [err.message],
					warnings: [],
				})
			} else {
				messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }))
			}
			if (messages.errors.length) {
				if (messages.errors.length > 1) {
					messages.errors.length = 1
				}
				return reject(new Error(messages.errors.join('\n\n')))
			}
			if (
				process.env.CI &&
				(typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
				messages.warnings.length
			) {
				console.log(
					chalk.yellow(
						'\nTreating warnings as errors because process.env.CI = true.\n' +
							'Most CI servers set it automatically.\n'
					)
				)
				return reject(new Error(messages.warnings.join('\n\n')))
			}

			return resolve({
				stats,
				previousFileSizes,
				warnings: messages.warnings,
			})
		})
	})
}

try {
	;(async () => {
		const config = await configFactory(process.env.NODE_ENV)

		const previousFileSizes = await measureFileSizesBeforeBuild(paths.appBuild)
		fs.emptyDirSync(paths.appBuild)
		copyPublicFolder()

		const { stats, warnings } = await build(config, previousFileSizes)

		if (warnings.length) {
			console.log(chalk.yellow('Compiled with warnings.\n'))
			console.log(warnings.join('\n\n'))
			console.log(
				'\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.'
			)
			console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n')
		} else {
			console.log(chalk.green('Compiled successfully.\n'))
		}

		console.log('File sizes after gzip:\n')
		printFileSizesAfterBuild(
			stats,
			previousFileSizes,
			paths.appBuild,
			WARN_AFTER_BUNDLE_GZIP_SIZE,
			WARN_AFTER_CHUNK_GZIP_SIZE
		)
		console.log()
	})()
} catch (err) {
	const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
	if (tscCompileOnError) {
		console.log(
			chalk.yellow(
				'Compiled with the following type errors (you may want to check these before deploying your app):\n'
			)
		)
		printBuildError(err)
	} else {
		console.log(chalk.red('Failed to compile.\n'))
		printBuildError(err)
		process.exit(1)
	}
}
