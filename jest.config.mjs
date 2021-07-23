/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.ts$': 'ts-jest'
	},
	moduleFileExtensions: ['js', 'ts']
};
