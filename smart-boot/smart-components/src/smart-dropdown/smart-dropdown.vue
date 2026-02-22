<script setup lang="ts">
import type { AnyNormalFunction } from '@vben/types';

import { computed } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { isFunction, omit } from '@vben/utils';

import { Dropdown, Menu, MenuItem, Popconfirm } from 'antdv-next';

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

function handleClickMenu(item: DropMenu) {
  const { event } = item;
  const menu = props.dropMenuList.find(
    (item) => `${item.event}` === `${event}`,
  );
  emit('menuEvent', menu);
  item.onClick?.();
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

const getAttr = (key: number | string) => ({ key });
</script>

<template>
  <Dropdown v-bind="$attrs" :trigger="trigger">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <Menu :selected-keys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <MenuItem
            v-bind="getAttr(item.event)"
            :disabled="item.disabled"
            @click="handleClickMenu(item)"
          >
            <Popconfirm
              v-if="popconfirm && item.popConfirm"
              v-bind="getPopConfirmAttrs(item.popConfirm)"
              :disabled="item.disabled"
            >
              <template v-if="item.popConfirm.icon" #icon>
                <IconifyIcon :icon="item.popConfirm.icon" />
              </template>
              <div>
                <IconifyIcon
                  v-if="item.preIcon"
                  :icon="item.preIcon"
                  class="anticon"
                />
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </Popconfirm>
            <template v-else>
              <IconifyIcon
                v-if="item.preIcon"
                :icon="item.preIcon"
                class="anticon"
              />
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </MenuItem>
          <Menu.Divider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>

<style scoped></style>
