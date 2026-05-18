import { defineConfig, SmartModulesVirtualPlugin } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [SmartModulesVirtualPlugin()],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            target: 'http://localhost:7080',
            ws: true,
          },
        },
      },
    },
  };
});
