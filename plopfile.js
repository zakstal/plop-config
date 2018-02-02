'use strict';
const path = require('path');

module.exports = function (plop) {
	// starting prompt can be customize to display what you want
	// plop.setWelcomeMessage('[CUSTOM]'.yellow + ' What can I do for you?');

	// helpers are passed through to handlebars and made
	// available for use in the generator templates

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	plop.addHelper('dashAround', (text) => '---- ' + text + ' ----');

	// formats an array of options like you would write
	// it if you were speaking (one, two, and three)
	plop.addHelper('wordJoin', function (words) {
		return words.join(', ').replace(/(:?.*),/, '$1, and');
	});

	plop.addHelper('absPath', function (p) {
		return path.resolve(plop.getPlopfilePath(), p);
	});

	// adding a custom inquirer prompt type
	plop.addPrompt('directory', require('inquirer-directory'));

	plop.setGenerator('create stateless component', {
		description: 'custom inquirer prompt example',
		prompts: [
			{
				type: 'input',
				name: 'fileName',
				message: 'Pick a file name:',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			},
			{
				type: 'confirm',
				name: 'isConnected',
				message: 'Connect component to redux store?'
			},
            {
				type: 'directory',
				name: 'path',
				message: 'where would you like to put this component?',
				basePath: path.join(__dirname, '..', 'src/components')
			}
		],
		actions: [
			function(data) {
				console.log(data);
				return 'yay';
			},
			{
				type: 'add',
				path: path.join(__dirname, '..', 'src/components', '{{path}}/{{ camelCase fileName}}.js'),
				templateFile: 'templates/statelessComponent.js.txt',
				abortOnFail: true
			},
			{
				type: 'add',
				path: path.join(__dirname, '..', 'src/components', '{{path}}/{{ camelCase fileName}}.css'),
				templateFile: 'templates/statelessComponent.css.txt',
				abortOnFail: true
			}
		]
	});

	plop.setGenerator('create component with state', {
		description: 'custom inquirer prompt example',
		prompts: [
			{
				type: 'input',
				name: 'fileName',
				message: 'Pick a file name:',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			},
			{
				type: 'confirm',
				name: 'isConnected',
				message: 'Connect component to redux store?'
			},
            {
				type: 'directory',
				name: 'path',
				message: 'where would you like to put this component?',
				basePath: path.join(__dirname, '..', 'src/components')
			}
		],
		actions: [
			function(data) {
				console.log(data);
				return 'yay';
			},
			{
				type: 'add',
				path: path.join(__dirname, '..', 'src/components', '{{path}}/{{ camelCase fileName}}.js'),
				templateFile: 'templates/componentWithState.js.txt',
				abortOnFail: true
			},
			{
				type: 'add',
				path: path.join(__dirname, '..', 'src/components', '{{path}}/{{ camelCase fileName}}.css'),
				templateFile: 'templates/statelessComponent.css.txt',
				abortOnFail: true
			}
		]
	});
	plop.setGenerator('Create quick reducer (see src/docs/TLDR.md for more details )', {
		description: 'custom inquirer prompt example',
		prompts: [
			{
				type: 'input',
				name: 'fileName',
				message: 'What is the reducer name: ',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			},

		],
		actions: [
			function(data) {
				console.log(data);
				return 'yay';
			},
			{
				type: 'modify',
				path: path.join(__dirname, '..', 'src/constants/Reducers.js'),
				pattern: /(-- PLOP APPEND REDUCER --)/gi,
				template: "$1\r\nexport const {{ upperCase (snakeCase fileName) }} = '{{ snakeCase fileName }}';"
			},
		]
	});
	plop.setGenerator('create new page', {
		description: 'custom inquirer prompt example',
		prompts: [
			{
				type: 'input',
				name: 'fileName',
				message: 'Pick a file name for the page:',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			},
			{
				type: 'input',
				name: 'route',
				message: 'What is the route? ex: /user/fun',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			},
			{
				type: 'input',
				name: 'routeName',
				message: 'Name the route with a short descriptive name',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			},
			{
				type: 'confirm',
				name: 'isAuthRoute',
				message: 'Does the route require login'
			}
		],
		actions: [
			function(data) {
				console.log(data);
				return 'yay';
			},
			{
				type: 'add',
				path: path.join(__dirname, '..', 'src/containers/pages', '{{ properCase fileName}}.js'),
				templateFile: 'templates/pageComponent.js.txt',
				abortOnFail: true
			},
			{
				type: 'modify',
				path: path.join(__dirname, '..', 'src/routes.js'),
				pattern: /(-- PLOP APPEND IMPORT --)/gi,
				template: "$1\r\nimport {{ properCase fileName }} from './containers/pages/{{ properCase fileName }}';"
			},
			{
				type: 'modify',
				path: path.join(__dirname, '..', 'src/routes.js'),
				pattern: /(-- PLOP APPEND ROUTE PATH --)/gi,
				template: "$1\r\n\t{{ camelCase routeName }}: '{{ route }}',"
			},
			{
				type: 'modify',
				path: path.join(__dirname, '..', 'src/routes.js'),
				pattern: /(-- PLOP APPEND ROUTE --\*\/})/gi,
				template: "$1{{#if isAuthRoute}}{{else}}\r\n\t\t\t<Route path={routePaths.{{~camelCase routeName~}}} component={ {{~properCase fileName~}} }/> {{/if}}"
			},
			{
				type: 'modify',
				path: path.join(__dirname, '..', 'src/routes.js'),
				pattern: /(-- PLOP APPEND AUTHROUTE --\*\/})/gi,
				template: "$1{{#if isAuthRoute}}\r\n\t\t\t<AuthRoute path={routePaths.{{~ camelCase routeName~}} } component={ {{~properCase fileName~}} }/> {{else}}{{/if}}"
			}
		]
	});
};

console.log(path.join(__dirname, '..', 'src/routes.js'))