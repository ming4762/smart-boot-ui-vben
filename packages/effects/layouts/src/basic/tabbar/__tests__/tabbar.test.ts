import { createApp } from 'vue';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import Tabbar from '../tabbar.vue';

const mocks = vi.hoisted(() => ({
  closeOtherTabs: vi.fn(),
  createContextMenus: vi.fn(() => {
    throw new Error('createContextMenus received an undefined tab');
  }),
  getTabByKey: vi.fn(() => undefined),
  sortTabs: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/closed', meta: {}, path: '/closed' }),
}));

vi.mock('@vben/hooks', () => ({
  useContentMaximize: () => ({
    contentIsMaximize: false,
    toggleMaximize: vi.fn(),
  }),
  useTabs: () => ({ refreshTab: vi.fn(), unpinTab: vi.fn() }),
}));

vi.mock('@vben/preferences', () => ({
  preferences: {
    tabbar: {
      draggable: false,
      middleClickToClose: false,
      persist: true,
      showMaximize: false,
      showMore: true,
      showRefresh: false,
      styleType: 'plain',
      wheelable: false,
    },
  },
}));

vi.mock('@vben/stores', () => ({
  useTabbarStore: () => ({
    closeOtherTabs: mocks.closeOtherTabs,
    getTabByKey: mocks.getTabByKey,
    sortTabs: mocks.sortTabs,
  }),
}));

vi.mock('@vben-core/tabs-ui', () => ({
  TabsToolMore: { props: ['menus'], template: '<div />' },
  TabsToolRefresh: { template: '<div />' },
  TabsToolScreen: { template: '<div />' },
  TabsView: { template: '<div />' },
}));

vi.mock('../use-tabbar', () => ({
  useTabbar: () => ({
    createContextMenus: mocks.createContextMenus,
    currentActive: { value: '/closed' },
    currentTabs: [],
    handleClick: vi.fn(),
    handleClose: vi.fn(),
  }),
}));

describe('LayoutTabbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not create more menus when the active tab has been removed', () => {
    const container = document.createElement('div');
    const app = createApp(Tabbar);

    expect(() => app.mount(container)).not.toThrow();
    expect(mocks.getTabByKey).toHaveBeenCalledWith('/closed');
    expect(mocks.createContextMenus).not.toHaveBeenCalled();

    app.unmount();
  });
});
