import { createApp, h, nextTick, reactive } from 'vue';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createIamPermissionAdapters } = vi.hoisted(() => ({
  createIamPermissionAdapters: vi.fn(() => ({
    functions: {},
    packages: {},
    roles: {},
    subscriptions: {},
  })),
}));

vi.mock('./adapters', () => ({ createIamPermissionAdapters }));

vi.mock('@smart-module/system', () => {
  const panel = { template: '<div />' };
  return {
    FunctionManagementPanel: panel,
    RoleManagementPanel: panel,
    TenantPackageManagementPanel: panel,
    TenantSubscriptionManagementPanel: panel,
  };
});

vi.mock('antdv-next', () => ({
  Empty: { template: '<div />' },
}));

import ClientPermissionPanels from './ClientPermissionPanels.vue';

function mountPanels(tab: string) {
  const props = reactive({
    activated: true,
    clientId: 1,
    tab,
    tenantId: 10,
  });
  const app = createApp({
    setup: () => () => h(ClientPermissionPanels, props),
  });
  const host = document.createElement('div');
  app.mount(host);
  return { app, props };
}

describe('ClientPermissionPanels', () => {
  beforeEach(() => {
    createIamPermissionAdapters.mockClear();
  });

  it.each(['function', 'package'])(
    'does not reload the %s panel when tenant changes',
    async (tab) => {
      const { app, props } = mountPanels(tab);

      expect(createIamPermissionAdapters).toHaveBeenCalledTimes(1);

      props.tenantId = 20;
      await nextTick();

      expect(createIamPermissionAdapters).toHaveBeenCalledTimes(1);
      app.unmount();
    },
  );

  it.each(['role', 'subscription'])(
    'reloads the %s panel when tenant changes',
    async (tab) => {
      const { app, props } = mountPanels(tab);

      props.tenantId = 20;
      await nextTick();

      expect(createIamPermissionAdapters).toHaveBeenCalledTimes(2);
      app.unmount();
    },
  );
});
