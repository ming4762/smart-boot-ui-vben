<script setup lang="ts">
import type { MenuRecordRaw } from '@vben-core/typings';

import { computed } from 'vue';

import { MenuBadge, MenuItem, SubMenu as SubMenuComp } from './components';
import SubMenu from './sub-menu.vue';

interface Props {
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}

defineOptions({
  name: 'SubMenuUi',
});

const props = withDefaults(defineProps<Props>(), {});

defineSlots<{
  'item-extra'(props: { menu: MenuRecordRaw }): any;
}>();

/**
 * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
 */
const hasChildren = computed(() => {
  const { menu } = props;
  return (
    Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
  );
});
</script>

<template>
  <MenuItem
    v-if="!hasChildren"
    :key="menu.key ?? menu.path"
    :active-icon="menu.activeIcon"
    :badge="menu.badge"
    :badge-type="menu.badgeType"
    :badge-variants="menu.badgeVariants"
    :icon="menu.icon"
    :disabled="menu.disabled"
    :path="menu.key ?? menu.path"
    :query="menu.query"
    :target-path="menu.targetPath ?? menu.path"
  >
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
    <template #extra>
      <slot name="item-extra" :menu="menu"></slot>
    </template>
  </MenuItem>
  <SubMenuComp
    v-else
    :key="`${menu.key ?? menu.path}_sub`"
    :active-icon="menu.activeIcon"
    :icon="menu.icon"
    :path="menu.key ?? menu.path"
  >
    <template #content>
      <MenuBadge
        :badge="menu.badge"
        :badge-type="menu.badgeType"
        :badge-variants="menu.badgeVariants"
        class="right-6"
      />
    </template>
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
    <template
      v-for="childItem in menu.children || []"
      :key="childItem.key ?? childItem.path"
    >
      <SubMenu :menu="childItem">
        <template #item-extra="{ menu: slotMenu }">
          <slot name="item-extra" :menu="slotMenu"></slot>
        </template>
      </SubMenu>
    </template>
  </SubMenuComp>
</template>
