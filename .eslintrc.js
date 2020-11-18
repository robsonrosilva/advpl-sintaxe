/**@type {import('eslint').Linter.Config} */
// eslint-disable-next-line no-undef
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-object-literal-type-assertion": "off",
		"@typescript-eslint/camelcase": "off",
		"@typescript-eslint/member-delimiter-style": [
			"error",
			{
				"singleline": {
					"delimiter": "semi",
					"requireLast": true
				}
			}
		]
	}
};