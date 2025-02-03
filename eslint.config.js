import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    prettierConfig,
    {
        ignores: ['node_modules', 'dist', 'build', '/.git'],
    },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
            },
        },
        plugins: {
            prettier: pluginPrettier,
        },
    },
    {
        rules: {
            'prettier/prettier': 'error',
            'no-unused-vars': 'off',
            indent: ['warn', 4],
            'linebreak-style': [0, 'unix'],
            quotes: ['error', 'single'],
            semi: ['warn', 'always'],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 0,
            'comma-dangle': ['error', 'always-multiline'],
            'space-before-function-paren': ['off'],
        },
    },
];
