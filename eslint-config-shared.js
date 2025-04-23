const { includeIgnoreFile } = require('@eslint/compat')
const unicorn = require('eslint-plugin-unicorn')
const { FlatCompat } = require('@eslint/eslintrc')
const globals = require('globals')
const tseslint = require('typescript-eslint')
const path = require('path')
const compat = new FlatCompat()
const eslintNewline = require('eslint-plugin-newline-destructuring')

const rootDir = process.cwd()
const gitignorePath = path.resolve(rootDir, '.gitignore')

module.exports = [
    includeIgnoreFile(gitignorePath),
    ...compat.extends('eslint-config-standard'),
    {
        languageOptions: {
            globals: {
                sinon: true,
                chai: true,
                returnError: true,
                newPromise: true,
                ...globals.node,
                ...globals.mocha,
                ...globals.jasmine,
                ...globals.jest
            }
        },
        plugins: {
            unicorn,
            'newline-destructuring': eslintNewline
        },
        rules: {
            'unicorn/prefer-ternary': ['error', 'always'],
            'space-before-function-paren': ['error', 'always'],
            'unicorn/catch-error-name': ['error', { ignore: [/error$|^error|^e$|exception$|^exception/gmi] }],
            'unicorn/consistent-existence-index-check': ['error'],
            'unicorn/consistent-function-scoping': ['error'],
            'unicorn/empty-brace-spaces': ['error'],
            'unicorn/error-message': ['error'],
            'unicorn/new-for-builtins': ['error'],
            'unicorn/no-abusive-eslint-disable': ['error'],
            'unicorn/no-await-expression-member': ['error'],
            'unicorn/no-await-in-promise-methods': ['error'],
            'unicorn/no-empty-file': ['error'],
            'unicorn/no-for-loop': ['error'],
            'unicorn/no-lonely-if': ['error'],
            'unicorn/no-negated-condition': ['error'],
            'unicorn/no-negation-in-equality-check': ['error'],
            'unicorn/no-nested-ternary': ['error'],
            'unicorn/prefer-array-find': ['error'],
            'unicorn/prefer-array-index-of': ['error'],
            'unicorn/prefer-array-some': ['error'],
            'unicorn/prefer-at': ['error'],
            'unicorn/prefer-date-now': ['error'],
            'unicorn/prefer-includes': ['error'],
            'unicorn/prefer-math-min-max': ['error'],
            'unicorn/prefer-native-coercion-functions': ['error'],
            'unicorn/prefer-logical-operator-over-ternary': ['error'],
            'unicorn/prefer-negative-index': ['error'],
            'unicorn/prefer-number-properties': ['error'],
            'unicorn/prefer-regexp-test': ['error'],
            'unicorn/prefer-string-raw': ['error'],
            'unicorn/template-indent': ['error'],
            'unicorn/throw-new-error': ['error'],
            'unicorn/prefer-string-starts-ends-with': ['error'],
            'unicorn/filename-case': ['error', { case: 'kebabCase' }],
            'prefer-regex-literals': 'off',
            'no-useless-escape': 'off',
            'no-useless-constructor': 'off',
            'newline-destructuring/newline': ['error', {
                items: 50,
                maxLength: 80
            }],
            quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }]
        }
    },
    {
        files: ['test/**/*', '**/*spec.ts', '**/*spec.js'],
        rules: {
            'no-unused-expressions': 'off',
            'unicorn/consistent-function-scoping': 'off'
        }
    },
    ...tseslint.configs.recommended.map(conf => ({
        ...conf,
        rules: {
            ...conf.rules,
            '@typescript-eslint/no-require-imports': 'off'
        },
        files: ['**/*.ts']
    }))
]
