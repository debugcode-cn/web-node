module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['standard'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-undefined': [1],
        'no-unused-vars': [1],
        'no-console': [1],
        'node/no-unsupported-features/es-syntax': [1],
    },
};
