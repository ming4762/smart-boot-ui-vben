<script setup lang="tsx">
import type { SmartTableActions } from '../types';
import type {
  SmartTableActionItem,
  SmartTableRowActionProps,
} from '../types/SmartTableRowActionType';

import { computed, h, toRaw, unref, useSlots, type VNode } from 'vue';

import { createIconifyIcon } from '@vben-core/icons';
import { isBoolean, isFunction, isString } from '@vben-core/shared/utils';

import { VxeButton } from 'vxe-pc-ui';

import { ACTION_COLUMN_FLAG } from '../constant';
import {
  injectSmartTableContext,
  useSmartTableContext,
} from '../types/useSmartTableContext';
import { getComponent } from '../utils';
import PopConfirmVxeButton from './PopConfirmVxeButton.vue';

interface Prop extends SmartTableRowActionProps {}

const props = withDefaults(defineProps<Prop>(), {
  divider: true,
  stopButtonPropagation: false,
});

const slots = useSlots();

let table: Partial<
  { t: (key: string, args?: any) => string } & SmartTableActions
> = {};
if (!props.outside) {
  table = injectSmartTableContext();
}

const getI18n = (code: string, ...args: any[]) => {
  return table?.t?.(code, ...args);
};

const getTooltipComponent = () => {
  return getComponent('Tooltip');
};

const getDividerComponenet = () => {
  return getComponent('Divider');
};

const getDropdownComponenet = () => {
  return getComponent('Dropdown');
};

function isIfShow(action: SmartTableActionItem): boolean {
  const ifShow = action.ifShow;

  let isIfShow = true;

  if (isBoolean(ifShow)) {
    isIfShow = ifShow;
  }
  if (isFunction(ifShow)) {
    isIfShow = ifShow(action);
  }
  return isIfShow;
}

const getActions = computed(() => {
  const {
    tableInnerAction: { hasPermission },
  } = useSmartTableContext();
  return (toRaw(props.actions) || [])
    .filter((action) => {
      return isIfShow(action);
    })
    .map((action) => {
      const { popConfirm } = action;
      return {
        getPopupContainer: () =>
          unref((table as any)?.wrapRef.value) ?? document.body,
        mode: 'text',
        size: 'small',
        status: action.danger ? 'danger' : 'primary',
        ...action,
        ...popConfirm,
        enable: !!popConfirm,
        // TODO:
        hasAuth: hasPermission(action.auth),
        onCancel: popConfirm?.cancel,
        onConfirm: popConfirm?.confirm,
      };
    });
});

const getDropdownList = computed((): any[] => {
  const {
    tableInnerAction: { hasPermission },
  } = useSmartTableContext();
  // 过滤掉隐藏的dropdown,避免出现多余的分割线
  const list = (toRaw(props.dropDownActions) || []).filter((action) => {
    return isIfShow(action);
  });
  return list.map((action, index) => {
    const { label, popConfirm } = action;
    return {
      ...action,
      ...popConfirm,
      disabled: !hasPermission(action.auth) || action.disabled,
      divider: index < list.length - 1 ? props.divider : false,
      // TODO:
      hasAuth: hasPermission(action.auth),
      onCancel: popConfirm?.cancel,
      onConfirm: popConfirm?.confirm,
      text: label,
    };
  });
});

const getAlign = computed(() => {
  const columns = (table as SmartTableActions)?.getColumns?.() || [];
  const actionColumn = columns.find(
    (item: any) => item.flag === ACTION_COLUMN_FLAG,
  );
  return actionColumn?.align ?? 'left';
});

function getTooltip(data: Record<string, any> | string): Record<string, any> {
  return {
    getPopupContainer: () =>
      unref((table as any)?.wrapRef.value) ?? document.body,
    placement: 'bottom',
    ...(isString(data) ? { title: data } : data),
  };
}

function onCellClick(e: MouseEvent) {
  if (!props.stopButtonPropagation) return;
  const path = e.composedPath() as HTMLElement[];
  const isInButton = path.find((ele) => {
    return ele.tagName?.toUpperCase() === 'BUTTON';
  });
  isInButton && e.stopPropagation();
}

/**
 * 渲染drop down
 * @constructor
 */
const RenderDropdown = () => {
  if (!(unref(props.dropDownActions) && unref(getDropdownList).length > 0)) {
    return null;
  }
  const slotMore = slots.more;
  const children: { [index: string]: () => VNode } = {};
  if (slotMore) {
    children.more = () => slotMore();
  } else {
    children.default = () =>
      h(
        VxeButton,
        {
          mode: 'text',
          size: 'small',
          status: 'primary',
        },
        {
          default: () => [
            '更多',
            h(createIconifyIcon('mdi-light:chevron-down')),
          ],
        },
      );
  }
  return h(
    getDropdownComponenet(),
    {
      dropMenuList: unref(getDropdownList),
      popconfirm: true,
      trigger: ['hover'],
    },
    children,
  );
};

const RenderDivider = (index: number) => {
  if (!(unref(props.divider) && index < unref(getActions).length - 1)) {
    return null;
  }
  return h(getDividerComponenet(), {
    class: ['action-divider'],
    type: 'vertical',
  });
};

const RenderPopConfirmVxeButton = (action: any) => {
  const props = {
    ...action,
    disabled: !action.hasAuth,
    t: getI18n,
  };
  return h(PopConfirmVxeButton, props, {
    default: () => {
      if (action.icon) {
        return h(
          createIconifyIcon(action.icon, { class: { 'mr-1': !!action.label } }),
        );
      } else if (action.label) {
        return action.label;
      }
      return null;
    },
  });
};

const RenderTooltip = (action: any) => {
  const props: { [index: string]: any } = {};
  const hasAuth = action.hasAuth;
  let isRenderButton = false;
  if (!hasAuth) {
    Object.assign(props, {
      color: 'red',
      title: getI18n('smartTable.message.noPermission'),
    });
  } else if (action.tooltip) {
    Object.assign(props, getTooltip(action.tooltip));
  } else {
    isRenderButton = true;
  }
  if (isRenderButton) {
    return RenderPopConfirmVxeButton(action);
  }
  return h(getTooltipComponent(), props, {
    default: () => RenderPopConfirmVxeButton(action),
  });
};

const RenderFunction = () => {
  return (
    <div class={[unref(getAlign)]} onClick={(event) => onCellClick(event)}>
      {unref(getActions).map((action, index) => {
        const result = [];
        if (action.slot) {
          result.push(this.$slots.customButton && this.$slots.customButton());
        } else {
          result.push(RenderTooltip(action));
        }
        result.push(RenderDivider(index));
        return result;
      })}
      {RenderDropdown()}
    </div>
  );
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped></style>
