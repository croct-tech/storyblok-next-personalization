import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import croct from '@croct/eslint-plugin';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    croct.configs.typescript,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js', '*.mjs'],
                },

            },
        },
    },
    {
        files: ['**/*.tsx', 'eslint.config.mjs', 'postcss.config.mjs'],
        rules: {
            '@stylistic/max-len': 'off',
        },
    },
    {
        files: [
            '**/page.tsx',
            '**/layout.tsx',
            '**/loading.tsx',
            '**/template.tsx',
            'next.config.ts',
            'eslint.config.mjs',
            'postcss.config.mjs',
        ],
        rules: {
            'import-x/no-default-export': 'off',
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
    // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
]);

export default eslintConfig;
