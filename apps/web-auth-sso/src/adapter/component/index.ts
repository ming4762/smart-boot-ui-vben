import type { Component } from 'vue';

import { componentAdapter } from '@vben/common-ui';

type ComponentName =
  | 'Alert'
  | 'CopyInput'
  | 'VbenButton'
  | 'VbenInput'
  | 'VbenInputPassword'
  | 'VbenSelect';

const components: Partial<Record<ComponentName, Component>> = {};

function initComponentAdapter() {
  componentAdapter.setup(components as any);
}

export { initComponentAdapter };
