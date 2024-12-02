import type { AnyFunction } from '@vben/types';

import type { CreateContextOptions } from './types';

import { createVNode, render } from 'vue';

import ContextMenu from './context-menu.vue';

const menuManager: {
  domList: Element[];
  resolve: AnyFunction<any, any>;
} = {
  domList: [],
  resolve: () => {},
};

const createContextMenu = (options: CreateContextOptions) => {
  const { event } = options || {};

  event && event?.preventDefault();

  return new Promise((resolve) => {
    const body = document.body;

    const container = document.createElement('div');
    const propsData: Partial<ContextMenuProps> = {};
    if (options.styles) {
      propsData.styles = options.styles;
    }

    if (options.items) {
      propsData.items = options.items;
    }

    if (options.event) {
      propsData.customEvent = event;
      propsData.axis = { x: event.clientX, y: event.clientY + body.scrollTop }; // y坐标需加上body往上滚动的Y
    }

    const vm = createVNode(ContextMenu, propsData);
    render(vm, container);

    const handleClick = function () {
      menuManager.resolve('');
    };

    menuManager.domList.push(container);

    const remove = function () {
      menuManager.domList.forEach((dom: Element) => {
        try {
          dom && dom.remove();
        } catch {
          //
        }
      });
      body.removeEventListener('click', handleClick);
      body.removeEventListener('scroll', handleClick);
    };

    menuManager.resolve = function (arg) {
      remove();
      resolve(arg);
    };
    remove();
    body.append(container);
    body.addEventListener('click', handleClick);
    body.addEventListener('scroll', handleClick);
  });
};

const destroyContextMenu = function () {
  if (menuManager) {
    menuManager.resolve('');
    menuManager.domList = [];
  }
};

export { createContextMenu, destroyContextMenu };
