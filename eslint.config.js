import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
    // Règles spécifiques pour les fichiers de tests
    {
        files: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // Autorisé dans les tests pour les mocks
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**', '*.js', '!eslint.config.js'],
    }
);
