import type { Component } from 'vue';

import { globalShareState } from '@vben/common-ui';

function initComponentAdapter() {
  const components: Partial<Record<string, Component>> = {};

  globalShareState.setComponents(components);

  globalShareState.defineMessage({
    copyPreferencesSuccess: (_title, _content) => {},
    success: () => {},
    error: () => {},
    warning: () => {},
    confirm: () => {},
  });
}

export { initComponentAdapter };
