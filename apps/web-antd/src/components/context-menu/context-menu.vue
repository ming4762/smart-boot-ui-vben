<script setup lang="tsx">
import type {
  ContextMenuItem,
  ContextMenuProps,
  ItemContentProps,
} from './type';

import {
  computed,
  type CSSProperties,
  type FunctionalComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  unref,
  useTemplateRef,
} from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { Divider, Menu } from 'ant-design-vue';

interface Props extends ContextMenuProps {}

defineOptions({
  name: 'ContextMenu',
});

const props = withDefaults(defineProps<Props>(), {
  width: 156,
  showIcon: true,
  axis: () => ({ x: 0, y: 0 }),
  items: () => [],
  styles: undefined,
  customEvent: undefined,
});

const prefixCls = 'context-menu';

const wrapRef = useTemplateRef<typeof Menu>('wrapRef');
const showRef = ref(false);

const getStyle = computed((): CSSProperties => {
  const { axis, items, styles, width } = props;
  const { x, y } = axis || { x: 0, y: 0 };
  const menuHeight = (items || []).length * 40;
  const menuWidth = width;
  const body = document.body;

  const left = body.clientWidth < x + menuWidth ? x - menuWidth : x;
  const top = body.clientHeight < y + menuHeight ? y - menuHeight : y;
  return {
    position: 'absolute',
    width: `${width}px`,
    left: `${left + 1}px`,
    top: `${top + 1}px`,
    zIndex: 9999,
    ...styles, // Not the first, fix options.styles.width not working
  };
});

onMounted(() => {
  nextTick(() => (showRef.value = true));
});

onUnmounted(() => {
  const el = unref(wrapRef);
  el && el.remove();
});

function handleAction(item: ContextMenuItem, e: MouseEvent) {
  const { handler, disabled } = item;
  if (disabled) {
    return;
  }
  showRef.value = false;
  e?.stopPropagation();
  e?.preventDefault();
  handler?.();
}

const createIcon = (icon: string) => {
  return h(createIconifyIcon(icon), { class: 'mr-2 anticon' });
};

const ItemContent: FunctionalComponent<ItemContentProps> = (props) => {
  const { item } = props;
  return (
    <span
      class="px-4"
      onClick={props.handler.bind(null, item)}
      style="display: inline-block; width: 100%; "
    >
      {props.showIcon && item.icon && createIcon(item.icon)}
      <span>{item.label}</span>
    </span>
  );
};

const doRenderMenuItem = (items: ContextMenuItem[]) => {
  const visibleItems = items.filter((item) => !item.hidden);
  return visibleItems.map((item) => {
    const { disabled, label, children, divider = false } = item;

    const contentProps = {
      item,
      handler: handleAction,
      showIcon: props.showIcon,
    };

    if (!children || children.length === 0) {
      return (
        <>
          <Menu.Item
            class={`${prefixCls}__item`}
            disabled={disabled}
            key={label}
          >
            <ItemContent {...contentProps} />
          </Menu.Item>
          {divider ? <Divider key={`d-${label}`} /> : null}
        </>
      );
    }
    if (!unref(showRef)) return null;

    return (
      <Menu.SubMenu
        disabled={disabled}
        key={label}
        popupClassName={`${prefixCls}__popup`}
      >
        {{
          title: () => <ItemContent {...contentProps} />,
          default: () => doRenderMenuItem(children),
        }}
      </Menu.SubMenu>
    );
  });
};

const RenderMenuItem = () => {
  return doRenderMenuItem(props.items);
};
</script>

<template>
  <Menu
    v-if="showRef"
    ref="wrapRef"
    :class="prefixCls"
    :inline-indent="12"
    :style="getStyle"
    mode="vertical"
  >
    <RenderMenuItem />
  </Menu>
</template>

<style lang="less">
@default-height: 42px !important;

@small-height: 36px !important;

@large-height: 36px !important;

.item-style() {
  li {
    display: inline-block;
    width: 100% !important;
    height: @default-height;
    margin: 0 !important;
    line-height: @default-height;

    span {
      line-height: @default-height;
    }

    > div {
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
    }

    //&:not(.ant-menu-item-disabled):hover {
    //  background-color: @item-hover-bg;
    //  color: @text-color-base;
    //}
  }
}

.context-menu {
  display: block;
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 156px;
  margin: 0;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 8px;
  background-clip: padding-box;
  //background-color: @component-background;
  box-shadow:
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 10%),
    0 1px 5px 0 rgb(0 0 0 / 6%);
  list-style: none;
  user-select: none;

  &__item {
    margin: 0 !important;
  }
  .item-style();

  .ant-divider {
    margin: 0;
  }

  &__popup {
    .ant-divider {
      margin: 0;
    }

    .item-style();
  }

  .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 0 !important;
  }
}
</style>
