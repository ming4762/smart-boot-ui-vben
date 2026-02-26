// import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en-US', name: 'English', file: 'en-US.json' },
    ],
    langDir: 'locales/langs/',
    restructureDir: './app/i18n',
  },
  runtimeConfig: {
    // eslint-disable-next-line n/prefer-global/process
    serverUrl: process.env.NUXT_SERVER_URL,
  },
  vite: {
    plugins: [
      // tailwindcss({
      //   optimize: {
      //     minify: true,
      //   },
      // }),
    ],
    build: {
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames: `_nuxt/[name].[hash].js`,
          entryFileNames: '_nuxt/[name].[hash].js',
          assetFileNames: '_nuxt/[name].[hash].[ext]',
        },
        cache: true, // 缓存
      },
      cssCodeSplit: true, // 是否开启css代码分割
      chunkSizeWarningLimit: 100, // 构建时超过这个阈值的文件打包会标黄
      reportCompressedSize: true, // 构建时是否生成 gzip 压缩包
      assetsInlineLimit: 1024, // 所有图片都不用打包进js文件中，【当静态资源小于1kb时候，会被转换为base64打入js文件】
    },
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // mock代理目标地址
          target: 'http://localhost:8080',
          ws: true,
        },
      },
    },
  },
});
