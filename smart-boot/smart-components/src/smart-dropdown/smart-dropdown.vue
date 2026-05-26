<script setup lang="ts">
import type { MenuItemType } from 'antdv-next';

import type { AnyNormalFunction } from '@vben/types';

import { computed } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { isFunction, omit } from '@vben/utils';

import { Dropdown, Popconfirm } from 'antdv-next';

type TriggerType = 'click' | 'contextmenu' | 'hover';

interface DropMenu {
  disabled?: boolean;
  divider?: boolean;
  event: number | string;
  onClick?: AnyNormalFunction<void[], void>;
  preIcon?: string;
  text: string;
  to?: string;
}

interface Props {
  dropMenuList?: (DropMenu & Record<string, any>)[];
  popconfirm?: boolean;
  selectedKeys?: string[];
  trigger?: TriggerType[];
}

const props = withDefaults(defineProps<Props>(), {
  trigger: () => ['contextmenu'],
  dropMenuList: () => [],
  selectedKeys: () => [],
});
const emit = defineEmits(['menuEvent']);

function handleClickMenu(key: string) {
  const item = props.dropMenuList.find(
    (i) => `${i.event}` === key,
  );
  if (item) {
    emit('menuEvent', item);
    item.onClick?.();
  }
}

function handleMenuClick(info: { key: string }) {
  handleClickMenu(info.key);
}

const getPopConfirmAttrs = computed(() => {
  return (attrs: any) => {
    const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
    if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
      originAttrs.onConfirm = attrs.confirm;
    if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
      originAttrs.onCancel = attrs.cancel;
    return originAttrs;
  };
});

const popConfirmMap = computed(() => {
  const map = new Map<string, any>();
  for (const item of props.dropMenuList) {
    if (item.popConfirm) {
      map.set(`${item.event}`, item.popConfirm);
    }
  }
  return map;
});

const preIconMap = computed(() => {
  const map = new Map<string, string>();
  for (const item of props.dropMenuList) {
    if (item.preIcon) {
      map.set(`${item.event}`, item.preIcon);
    }
  }
  return map;
});

const menuProps = computed(() => {
  const items: MenuItemType[] = [];
  for (const item of props.dropMenuList) {
    items.push({
      key: `${item.event}`,
      label: item.text,
      disabled: item.disabled,
    });
    if (item.divider) {
      items.push({ type: 'divider', key: `d-${item.event}` });
    }
  }
  return {
    items,
    selectedKeys: props.selectedKeys,
  };
});
</script>

<template>
  <Dropdown
    v-bind="$attrs"
    :trigger="trigger"
    :menu="menuProps"
    @menu-click="handleMenuClick"
  >
    <span>
      <slot></slot>
    </span>
    <template #labelRender="menuItem">
      <Popconfirm
        v-if="
          popconfirm &&
            menuItem &&
            popConfirmMap.get(String(menuItem.key))
        "
        v-bind="
          getPopConfirmAttrs(popConfirmMap.get(String(menuItem.key)))
        "
        :disabled="menuItem.disabled"
      >
        <template
          v-if="popConfirmMap.get(String(menuItem.key))?.icon"
          #icon
        >
          <IconifyIcon
            :icon="popConfirmMap.get(String(menuItem.key)).icon"
          />
        </template>
        <span>
          <IconifyIcon
            v-if="preIconMap.get(String(menuItem.key))"
            :icon="preIconMap.get(String(menuItem.key))!"
            class="anticon"
          />
          <span class="ml-1">{{ menuItem.label }}</span>
        </span>
      </Popconfirm>
      <template v-else>
        <IconifyIcon
          v-if="preIconMap.get(String(menuItem.key))"
          :icon="preIconMap.get(String(menuItem.key))!"
          class="anticon"
        />
        <span class="ml-1">{{ menuItem.label }}</span>
      </template>
    </template>
  </Dropdown>
</template>
