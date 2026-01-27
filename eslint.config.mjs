import { defineConfig } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import vueTsConfig from '@vue/eslint-config-typescript';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  // Prettier 集成（放在最后，关闭与 Prettier 冲突的 ESLint 规则）
  prettierConfig,

  // Vue 插件配置
  ...pluginVue.configs['flat/essential'],
  ...vueTsConfig(),

  // 导入插件配置
  {
    plugins: {
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // === 全局和环境配置 ===
  {
    languageOptions: {
      globals: {
        // Node.js 全局变量
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',

        // 浏览器全局变量 (Web API)
        File: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        Image: 'readonly',
        FormData: 'readonly',
        XMLHttpRequest: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        FileReader: 'readonly',
        fetch: 'readonly'
      },
    },
  },

  // === 测试文件特殊规则 ===
  {
    files: ['**/test.{js,ts}', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },

  // === 自定义规则覆盖（基于 frontend-code-reviewer.md 规范） ===
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    rules: {
      // === 命名和变量规则 ===

      // 禁止使用 var，优先使用 const/let
      'no-var': 'error',
      'prefer-const': 'error',

      // 未使用变量检查（以下划线开头的参数除外）
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // 忽略枚举成员的未使用警告
          vars: 'all',
          args: 'all',
          reportUsedIgnorePattern: false,
        },
      ],

      // === 比较和操作符规则 ===

      // 强制使用严格相等比较（=== 和 !==）
      eqeqeq: ['error', 'always'],

      // 禁止使用 eval()（安全考虑）
      'no-eval': 'error',

      // === 函数和箭头函数规则 ===

      // 优先使用箭头函数作为回调函数
      'prefer-arrow-callback': 'error',

      // === 格式化规则由 Prettier 处理，这里不再配置 ===
      // 注意：indent, quotes, semi 等格式化规则已移除，由 Prettier 统一处理

      // === 注释规则 ===
      // 注释格式由 Prettier 处理

      // === 导入/导出规则 ===

      // 导入语句排序和格式
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 内置模块
            'external', // 第三方库
            'internal', // 项目内部模块
            'parent', // 父目录导入
            'sibling', // 兄弟文件导入
            'index', // 索引文件导入
          ],
          'newlines-between': 'always', // 组之间必须有空行
          alphabetize: { order: 'asc', caseInsensitive: true }, // 按字母顺序排序
        },
      ],

      // === TypeScript 规则 ===

      // 禁止使用 any 类型
      '@typescript-eslint/no-explicit-any': 'error',

      // === 代码质量规则 ===

      // 禁止未声明的变量
      'no-undef': 'error',

      // 禁止使用未定义的变量
      'no-undef-init': 'error',

      // 禁止空语句块
      'no-empty': 'error',

      // 禁止使用 with 语句
      'no-with': 'error',

      // 禁止使用 void 操作符
      'no-void': 'error',

      // 禁止使用一元 ++ 和 --
      'no-plusplus': 'error',
    },
  },

  // === Vue 特定规则 ===
  {
    files: ['**/*.vue'],
    rules: {
      // Vue 组件名称使用 PascalCase
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: [],
        },
      ],

      // 属性顺序：定义、列表/渲染、条件、渲染修饰符、事件、内容、v-model、v-bind、其他属性
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],


      // 强制使用 v-bind 简写
      'vue/v-bind-style': ['error', 'shorthand'],

      // 强制使用 v-on 简写
      'vue/v-on-style': ['error', 'shorthand'],

      // 强制使用 v-slot 简写
      'vue/v-slot-style': ['error', 'shorthand'],

      // 单行元素内容前后不允许有空格
      'vue/singleline-html-element-content-newline': 'off',

      // 多行元素内容前后必须有换行
      'vue/multiline-html-element-content-newline': 'off',

      // 属性格式由 Prettier 处理
      'vue/max-attributes-per-line': 'off',

      // 属性换行由 Prettier 处理
      'vue/first-attribute-linebreak': 'off',

      // HTML 缩进由 Prettier 处理
      'vue/html-indent': 'off',

      // HTML 结束标签换行由 Prettier 处理
      'vue/html-closing-bracket-newline': 'off',
    },
  },

  // === 全局忽略配置 ===
  {
    ignores: [
      // 构建和输出目录
      'dist/**', // Vite 构建输出
      'build/**', // 构建文件
      'out/**', // 静态导出输出

      // 依赖和工具文件
      'node_modules/**', // 依赖包
      '.git/**', // Git 文件
      '*.min.js', // 压缩文件
      '*.min.css', // 压缩 CSS 文件
      'coverage/**', // 测试覆盖率报告

      // 配置文件
      '.eslintrc.*', // ESLint 配置文件本身
      'prettier.config.*', // Prettier 配置文件
      'eslint.config.*', // ESLint 扁平配置
    ],
  },
]);
