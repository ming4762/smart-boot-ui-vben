import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        allowedHosts: true,
        // proxy: {
        //   '/api': {
        //     changeOrigin: true,
        //     rewrite: (path) => path.replace(/^\/api/, ''),
        //     target: 'http://localhost:7080',
        //     ws: true,
        //   },
        // },
      },
    },
  };
});
