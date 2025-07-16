import type { VxeGridListeners, VxeToolbarPropTypes } from 'vxe-table';

import type { ComputedRef, Ref, Slots } from 'vue';

import type {
  SmartTableRenderProps,
  SmartTableSize,
  SmartTableToolbarConfig,
} from '../types';
import type {
  SmartTableButton,
  SmartTableToolbarTool,
} from '../types/SmartTableButtonType';
import type { SmartTableContextHandler } from '../types/SmartTableInnerType';
import type { SmartTableToolbarSizeSetting } from '../types/SmartTableToolbarConfigType';

import { computed, ref, unref } from 'vue';

import { isBoolean, isPromise, isString, merge } from '@vben-core/shared/utils';

import { VxeUI } from 'vxe-table';

import SmartTableColumnConfig from '../components/SmartTableColumnConfig.vue';
import SmartTableSizeSetting from '../components/SmartTableSizeSetting.vue';
import { SmartTableCode } from '../constant';
import {
  SmartTableToolbarComponentRenderer,
  SmartTableToolbarCustomRenderer,
  SmartTableToolbarSlotRenderer,
  SmartTableToolbarVxeButtonRenderer,
} from '../types/SmartTableRenderType';

interface RefreshConfig {
  refresh: VxeToolbarPropTypes.Refresh;
  refreshOptions?: VxeToolbarPropTypes.RefreshOptions;
}

const t = VxeUI.getI18n;

const tableButtonSizeMap: { [key: string]: string } = {
  medium: 'middle',
  mini: 'small',
  small: 'small',
  tiny: 'small',
};

/**
 * 获取默认的添加按钮配置
 * @param t
 */
const getDefaultAddButtonConfig = (
  t: (args: string) => string,
): SmartTableButton => {
  return {
    buttonRender: {
      name: SmartTableToolbarCustomRenderer,
    },
    code: 'ModalAdd',
    name: t('smartTable.button.add'),
    props: {
      preIcon: 'ant-design:plus-outlined',
      type: 'primary',
    },
  };
};

const getDefaultEditButtonConfig = (
  t: (args: string) => string,
): SmartTableButton => {
  return {
    buttonRender: {
      name: SmartTableToolbarCustomRenderer,
    },
    code: 'ModalEdit',
    name: t('smartTable.button.edit'),
    props: {
      preIcon: 'ant-design:edit-outlined',
      type: 'primary',
    },
  };
};

const getDefaultDeleteButtonConfig = (
  t: (args: string) => string,
): SmartTableButton => {
  return {
    buttonRender: {
      name: SmartTableToolbarCustomRenderer,
    },
    code: 'delete',
    name: t('smartTable.button.delete'),
    props: {
      danger: true,
      preIcon: 'ant-design:delete-outlined',
      type: 'primary',
    },
  };
};

const getDefaultUseYnButtonConfig = (
  t: (args: string) => string,
  useYn: boolean,
): SmartTableButton => {
  const icon = useYn
    ? 'ant-design:check-outlined'
    : 'ant-design:close-outlined';
  return {
    buttonRender: {
      name: SmartTableToolbarCustomRenderer,
    },
    code: useYn ? 'useYnTrue' : 'useYnFalse',
    name: useYn ? t('smartTable.common.use') : t('smartTable.common.noUse'),
    props: {
      danger: !useYn,
      preIcon: icon,
      type: 'primary',
    },
  };
};

/**
 * 获取添加按钮配置
 * @param button
 * @param buttonSize
 * @param handler
 */
const getModalAddButton = (
  button: SmartTableButton,
  buttonSize: string | undefined,
  handler: () => void,
) => {
  return merge(
    button,
    {
      props: {
        onClick: () => {
          handler();
        },
      },
    },
    getDefaultAddButtonConfig(t),
    { size: buttonSize },
  ) as SmartTableButton;
};

/**
 * 获取编辑按钮配置
 * @param button
 * @param buttonSize
 * @param handler
 */
const getModalEditButton = (
  button: SmartTableButton,
  buttonSize: string | undefined,
  handler: () => void,
) => {
  return merge(
    button,
    {
      props: {
        onClick: () => {
          handler();
        },
      },
    },
    getDefaultEditButtonConfig(t),
    { size: buttonSize },
  ) as SmartTableButton;
};

/**
 * 获取删除按钮配置
 * @param button
 * @param buttonSize
 * @param handler
 */
const getDeleteButton = (
  button: SmartTableButton,
  buttonSize: string | undefined,
  handler?: () => void,
) => {
  return merge(
    button,
    {
      props: {
        onClick: () => {
          handler && handler();
        },
      },
    },
    getDefaultDeleteButtonConfig(t),
    { size: buttonSize },
  ) as SmartTableButton;
};

const getUseYnButton = (
  button: SmartTableButton,
  buttonSize: string | undefined,
  handler?: (useYn: boolean) => void,
) => {
  const useYn = button.code === 'useYnTrue';
  return merge(
    button,
    {
      props: {
        onClick: () => {
          handler && handler(useYn);
        },
      },
    },
    getDefaultUseYnButtonConfig(t, useYn),
    { size: buttonSize },
  ) as SmartTableButton;
};

/**
 * 获取响应性button props
 * @param button
 */
const getReactiveButtonProps = (button: SmartTableButton) => {
  const loading = ref(false);
  return computed<any>(() => {
    const buttonProps = unref(button.props) as any;
    const result: any = {
      ...buttonProps,
    };
    result.loading = unref(loading);
    const defaultClickHandler = buttonProps?.onClick;
    if (defaultClickHandler) {
      const handler = Array.isArray(defaultClickHandler)
        ? defaultClickHandler[0]
        : defaultClickHandler;
      result.onClick = async () => {
        try {
          loading.value = true;
          const handlerResult = handler();
          if (isPromise(handlerResult)) {
            await handlerResult;
          }
        } finally {
          loading.value = false;
        }
      };
    }
    return result;
  });
};

const convertCustomTools = (
  tools: SmartTableToolbarTool[],
  slots: Ref<Slots>,
) => {
  return tools.map((tool) => {
    const { slot } = tool;
    if (!slot) {
      return tool;
    }
    const slotFunction = isString(slot) ? unref(slots)[slot] : slot;
    return {
      ...tool,
      toolRender: {
        name: SmartTableToolbarSlotRenderer,
      },
      slot: slotFunction,
    } as SmartTableToolbarTool;
  });
};

export const useSmartTableToolbar = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  slots: Ref<Slots>,
  getSmartTableContext: SmartTableContextHandler,
  emit: (event: string, ...args: any[]) => void,
) => {
  /**
   * 转换按钮
   * @param buttonList
   * @param tableSize
   */
  const convertButtons = (
    buttonList: SmartTableButton[] | undefined,
    tableSize: SmartTableSize | undefined,
  ): SmartTableButton[] | undefined => {
    if (!buttonList) {
      return undefined;
    }
    const {
      deleteByCheckbox,
      editByCheckbox,
      setUseYnByCheckbox,
      showAddModal,
    } = getSmartTableContext();
    const buttonSize = tableSize ? tableButtonSizeMap[tableSize] : undefined;
    return buttonList.map((item) => {
      const { code } = item;
      if (code === 'ModalAdd') {
        return getModalAddButton(item, buttonSize, showAddModal);
      }
      if (code === 'ModalEdit') {
        return getModalEditButton(item, buttonSize, editByCheckbox);
      }
      if (code === 'delete') {
        return getDeleteButton(item, buttonSize, deleteByCheckbox);
      }
      if (code === 'useYnTrue' || code === 'useYnFalse') {
        return getUseYnButton(item, buttonSize, setUseYnByCheckbox);
      }
      // props添加响应性
      let props = item.props as any;
      if (item.clickLoading && props?.loading === undefined) {
        props = getReactiveButtonProps(item);
      }
      // 插槽渲染
      if (item.slot) {
        const slotFunction = isString(item.slot)
          ? unref(slots)[item.slot]
          : item.slot;
        return {
          size: buttonSize,
          buttonRender: {
            name: SmartTableToolbarSlotRenderer,
          },
          ...item,
          props,
          slot: slotFunction,
        } as SmartTableButton;
      }
      if (item.customRender) {
        return {
          buttonRender: {
            name: SmartTableToolbarCustomRenderer,
          },
          size: buttonSize,
          ...item,
          props,
        };
      }
      return {};
    });
  };

  /**
   * 转换按钮的权限
   * @param buttonList
   */
  const convertButtonAuth = (
    buttonList: SmartTableButton[] | undefined,
  ): SmartTableButton[] | undefined => {
    if (!buttonList) {
      return undefined;
    }
    if (buttonList.length === 0) {
      return [];
    }
    const authConfig = unref(tableProps).authConfig;
    if (!authConfig) {
      // 权限未配置，直接返回
      return buttonList;
    }
    const { authHandler, displayMode } = authConfig;
    if (!authHandler) {
      const {
        tableInnerAction: { hasPermission },
      } = getSmartTableContext();
      if (!hasPermission) {
        throw new Error(
          '未设置authConfig.authHandler并且未配置Props.hasPermission',
        );
      }
    }
    return buttonList
      .map((button) => {
        const { auth: buttonAuth } = button;
        if (!buttonAuth) {
          return button;
        }
        const hasAuth = authHandler(buttonAuth);
        if (hasAuth) {
          return button;
        }
        // todo: 添加tooltip
        return displayMode === 'hide'
          ? null
          : {
              ...button,
              props: {
                ...unref(button.props),
                disabled: true,
                hasAuth,
              },
            };
      })
      .filter((item) => item !== null) as SmartTableButton[];
  };

  const getDefaultRefreshConfig = (): VxeToolbarPropTypes.RefreshOptions => {
    const { query } = getSmartTableContext();
    return {
      queryMethod: (params) => {
        return query(params);
      },
    };
  };

  const convertRefresh = (
    refresh?: VxeToolbarPropTypes.Refresh,
    refreshOptions?: VxeToolbarPropTypes.RefreshOptions,
  ): RefreshConfig | undefined => {
    if (!refresh) {
      return undefined;
    }
    if (isBoolean(refresh)) {
      return refresh
        ? {
            refresh: true,
            refreshOptions: {
              ...getDefaultRefreshConfig(),
              ...refreshOptions,
            },
          }
        : {
            refresh: false,
          };
    }
    return {
      refresh: true,
      refreshOptions: {
        ...(getDefaultRefreshConfig() as any),
        ...refresh,
        ...refreshOptions,
      },
    };
  };

  const convertSizeSettingConfig = (
    sizeSetting: boolean | SmartTableToolbarSizeSetting,
  ): SmartTableToolbarTool => {
    return {
      code: SmartTableCode.sizeSetting,
      component: SmartTableSizeSetting,
      toolRender: {
        name: SmartTableToolbarComponentRenderer,
        props: {
          // todo: 默认配置
          config: isBoolean(sizeSetting) ? {} : sizeSetting,
        },
      },
    };
  };

  const convertTools = (toolbarConfig: SmartTableToolbarConfig | undefined) => {
    if (!toolbarConfig) {
      return undefined;
    }
    const { column, showSearch, sizeSetting, tools } = toolbarConfig;
    if (!tools && !showSearch && !column && !sizeSetting) {
      return undefined;
    }
    const result: SmartTableToolbarTool[] = [];
    // 处理tools
    if (tools && tools.length > 0) {
      result.push(...convertCustomTools(tools, slots));
    }
    if (showSearch && unref(tableProps).useSearchForm) {
      if (isBoolean(showSearch)) {
        const {
          tableInnerContext: { computedSearchFormVisible },
        } = getSmartTableContext();
        const props = computed(() => {
          return {
            circle: true,
            icon: 'vxe-icon-search',
            status: unref(computedSearchFormVisible) ? 'primary' : '',
            title: unref(computedSearchFormVisible)
              ? t('component.table.hideSearch')
              : t('component.table.showSearch'),
          };
        });
        result.push({
          code: SmartTableCode.showSearch,
          props,
          toolRender: {
            name: SmartTableToolbarVxeButtonRenderer,
          },
        });
      } else {
        result.push(showSearch);
      }
    }
    // 处理列配置
    if (column) {
      const columnConfig = isBoolean(column) ? undefined : column;
      result.push({
        code: SmartTableCode.column,
        component: SmartTableColumnConfig,
        toolRender: {
          name: SmartTableToolbarComponentRenderer,
          props: {
            config: columnConfig,
          },
        },
      });
    }
    if (sizeSetting) {
      result.push(convertSizeSettingConfig(sizeSetting));
    }
    return result;
  };

  const computedToolBarRefresh = computed<RefreshConfig | undefined>(() => {
    const { toolbarConfig } = unref(tableProps);
    return convertRefresh(
      toolbarConfig?.refresh,
      toolbarConfig?.refreshOptions,
    );
  });

  const computedToolbarTools = computed(() => {
    const { toolbarConfig } = unref(tableProps);
    return convertTools(toolbarConfig);
  });

  const computedToolbarConfig = computed(() => {
    const { size: tableSize, toolbarConfig } = unref(tableProps);
    if (!toolbarConfig) {
      return undefined;
    }
    let buttons = convertButtons(toolbarConfig.buttons, tableSize);
    buttons = convertButtonAuth(buttons);
    return {
      ...toolbarConfig,
      buttons,
      ...unref(computedToolBarRefresh),
      tools: unref(computedToolbarTools),
    };
  });

  /**
   * toolbar点击事件
   */
  const events: VxeGridListeners = {
    toolbarToolClick: (params) => {
      emit('toolbar-tool-click', params);
      const { code } = params;
      switch (code) {
        case SmartTableCode.showSearch: {
          const { switchSearchFormVisible } = getSmartTableContext();
          switchSearchFormVisible();
          break;
        }
      }
    },
  };

  const getToolbarEvents = computed(() => {
    const result: any = {};
    Object.keys(events).forEach((item) => {
      result[`on${item.slice(0, 1).toUpperCase() + item.slice(1)}`] = (
        events as any
      )[item];
    });
    return result;
  });

  return {
    computedToolbarConfig,
    getToolbarEvents,
  };
};
