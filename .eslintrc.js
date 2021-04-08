module.exports = {
    'env': {
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'auto',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:chai-expect/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        'jest'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'class-methods-use-this': 0,
        'jest/valid-expect': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unused-expressions': 0,
    }
};
