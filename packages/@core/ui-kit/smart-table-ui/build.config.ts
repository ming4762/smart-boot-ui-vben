import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: [
    {
      builder: 'mkdist',
      input: './src',
      loaders: ['vue'],
      pattern: ['**/*.vue'],
    },
    {
      builder: 'mkdist',
      format: 'esm',
      input: './src',
      loaders: ['js'],
      pattern: ['**/*.ts'],
    },
    {
      builder: 'copy',
      input: './src/style', // 假设 SCSS 文件在 src/style 目录下
      outDir: './dist/style',
      pattern: ['**/*.scss'],
    },
  ],
});
