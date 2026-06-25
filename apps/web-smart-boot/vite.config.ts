import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig, SmartModulesVirtualPlugin } from '@vben/vite-config';

// 自动读取 smart-modules 目录下所有模块并创建别名
function getSmartModuleAliases() {
  const baseDir = resolve(
    import.meta.dirname,
    '../../smart-boot/smart-modules',
  );
  const dirs = readdirSync(baseDir, { withFileTypes: true });
  const aliases: Record<string, string> = {};

  for (const dir of dirs) {
    if (dir.isDirectory() && dir.name.startsWith('smart-module-')) {
      const moduleName = dir.name.replace('smart-module-', '');
      aliases[`@smart-module/${moduleName}`] = resolve(
        baseDir,
        dir.name,
        'src',
      );
    }
  }
  return aliases;
}

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [SmartModulesVirtualPlugin()],
      resolve: {
        alias: {
          ...getSmartModuleAliases(),
        },
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
  };
});
