# @xstyled-theme/config

![https://img.shields.io/github/workflow/status/La-Javaness/xstyled-theme-config/Release](https://github.com/La-Javaness/xstyled-theme-config/actions?query=workflow%3ARelease)
![https://www.npmjs.com/package/@xstyled-theme/config](https://img.shields.io/npm/v/@xstyled-theme/config.svg)

This package helps your project link to a `@xstyled-theme` theme. It provides configuration hooks for Webpack and Jest, so that the import alias `~theme` in your code is resolved to the location of your current theme.

## Install

Install the dependencies needed to run this project. Note that `@xstyled` and `styled-components` should be installed as peer dependencies if your project is a library meant to be used in third-party apps.

### In Apps

```sh
yarn add @xstyled/styled-components @xstyled/system styled-components
yarn add -D @xstyled-theme/config
```

### In Libraries
```sh
yarn add -P @xstyled/styled-components @xstyled/system styled-components
yarn add -D @xstyled-theme/config
```


## Usage

### In a React App

@xstyled-theme/config can be used to inject a theme in a React App. Note that we only support apps generated with the [typescript template](https://create-react-app.dev/docs/adding-typescript/).

#### Prerequisites
You'll need an extra dependency to customise your React App configuration. Install it with:

```sh
yarn add -D react-app-rewired
```

Next, ensure your `package.json` file uses the `react-app-rewired` wrapper to let us inject configuration into your React App. Replace the existing scripts with the following:

```json
  "scripts": {
    "build": "react-app-rewired build",
    "start": "react-app-rewired start",
    "test": "react-app-rewired test"

  },
```

#### Pick a Theme

The most common way to select a theme to use is via the [`@xstyled-theme/cli`](https://github.com/La-Javaness/xstyled-theme-cli/blob/master/README.md). The `xstyled-theme set theme-squirrels` would make the `theme-squirrels` package your app's current theme, for instance.

Themes are saved in the `xstyledTheme.config.js` file. With the above example, this file would contain:

```js
module.exports = 'theme-squirrels'
```


#### Use @xstyled-theme/config

Create a file named `config-overrides.js`, containing:

```js
const { withXstyledThemeWebpack, withXstyledThemeJest } = require('@xstyled-theme/config')
const theme = require('./xstyledTheme.config')

module.exports = {
  webpack: withXstyledThemeWebpack(theme),
  jest: withXstyledThemeJest(theme),
}

```

Or if you want to apply additional overrides:

```js
const { withXstyledThemeWebpack, withXstyledThemeJest } = require('@xstyled-theme/config')
const theme = require('./xstyledTheme.config')

module.exports = {
  webpack: (config, env) => {
    const ownConfig = withXstyledThemeWebpack(theme)(config, env)

    // Your other overrides can be applied here to `ownConfig`.

    return ownConfig
  },
  jest: withXstyledThemeJest(theme),
}
```






### In a UI Toolkit

UI toolkits need to ensure they do not bundle `React`, `styled-components` or other packages that mustn't be duplicated in the dependency chain. `@xstyled-theme/config` comes with an option to declare such packages as externals. Here is what your `webpack.config.js` could look like:

```js
const { withXstyledThemeWebpack } = require('@xstyled-theme/config')
const theme = require('./xstyledTheme.config')

module.exports = async (webpackEnv) => {
	const config = {
		entry: path.resolve(__dirname, 'src', 'index.ts'),
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'index.js',
		},
		// etc
	}

	return withXstyledThemeWebpack(theme, { externals: true })(config)
}
```

In your `jest.config.js`, you can even use a different theme against which you write your tests (make sure that theme is installed in your development dependencies, though):
```js
const { withXstyledThemeJest } = require('@xstyled-theme/config')

module.exports = withXstyledThemeJest('my-test-theme')({
	roots: ['<rootDir>/src'],
	coverageReporters: ['json', 'lcov', 'text'],
	testMatch: ['**/__tests__/**/*.test.(js|ts|jsx|tsx)'],
})
```

### In StoryBook

Below is a sample configuration for Storybook, to be written in `.storybook/main.js`, and tested on StoryBook 5.3:

```js
const path = require('path')
const webpackConfig = require('../webpack.config')
const { withXstyledThemeWebpack } = require('@xstyled-theme/config')
const theme = require('../xstyledTheme.config')

module.exports = {
	stories: [ /* ... */ ],
	addons: [ /* ... */ ],
	webpackFinal: async config => withXstyledThemeWebpack(theme)(config)
}
```



### Jest transformIgnorePatterns

It's very common to find, in Jest configs, a line that prevents transformation of dependencies found in node_modules, through the [transformIgnorePatterns](TODO) option. Unfortunately, `@xstyled-theme` provides Typescript files which must be transformed, so this approach is unsuitable. We automatically remove the following lines from `transformIgnorePatterns` to avoid a compatibility issue:

* `<rootDir>/node_modules/`
* `<rootDir>/node_modules`
* `/node_modules/`
* `/node_modules`
* `node_modules/`
* `node_modules`

We then inject a new line that filters all `node_modules` except the ones we want to have transformed.

#### Ignore Additional Patterns

If you also need other modules to be transformed, add their names to the `modulesToTransform` option. For example, if you used to ignore every module except `foo` and `bar`, as well as the `vendors` directory, your original  `jest.config.js` file should look like this:

```js
module.exports = {
	transformIgnorePatterns: ['<rootDir>/node_modules/(?!foo|bar)', '<rootDir>/vendors/'],
}

```

You should change it to:

```js
const { withXstyledThemeJest } = require('@xstyled-theme/config')
const theme = require('./xstyledTheme.config')

module.exports = withXstyledThemeJest(theme, {
	modulesToTransform: ['foo', 'bar'],
})({
	transformIgnorePatterns: ['<rootDir>/vendors/'],
})

```








## Typescript – Coming Soon

Some aspects are not yet covered in this doc, including support for the `tsconfig.json` file. Please notify the developers if you need help running `@xstyled-theme/config` with TypeScript until this part of the doc is written up.

We also don't explain yet how to import type declarations from the theme. This will also be documented in the future but is still subject to minor adjustments.







## Usage Example

The following code defines an API to style a component with an `@xstyled-theme` theme, loads the current theme, and provides the theme's variables into the `styled` function as props using [styled-component attrs](https://styled-components.com/docs/api#attrs).

```
import styledFactory from '~theme/components/MyComponent.style'

const MyComponentApi = {
	textColor: null,
	textDecoration: null,
	textTransform: null,
}

const styled = styledFactory(MyComponentApi)

export const MyComponentRoot = styled('button')(
	(props) => css`
		color: ${props.textColor};
		text-decoration: ${props.textDecoration};
		text-transform: ${props.textTransform};
	`
)
```
