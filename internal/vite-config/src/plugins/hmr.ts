import type { Plugin } from 'vite';

/**
 * TODO
 * Temporarily solve the Vite circular dependency problem, and wait for a better solution to fix it later. I don't know what problems this writing will bring.
 * @returns
 */

export function configHmrPlugin(): Plugin {
  return {
    name: 'singleHMR',
    handleHotUpdate({ modules, file }) {
      if (file.match(/xml$/)) return [];
      if (file.match(/\.(ts|js)/)) return undefined;

      modules.forEach((m) => {
        if (!m.url.match(/\.(css|less)/)) {
          m.importers = new Set();
        }
      });
      return modules;
    },
  };
}
