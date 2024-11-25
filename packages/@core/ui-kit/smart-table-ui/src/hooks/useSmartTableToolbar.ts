import type { VxeToolbarPropTypes } from 'vxe-table';

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

import { computed, type ComputedRef, h, unref } from 'vue';

import { createIconifyIcon } from '@vben-core/icons';
import { isBoolean, merge } from '@vben-core/shared/utils';

import SmartTableColumnConfig from '../components/SmartTableColumnConfig.vue';
import SmartTableSizeSetting from '../components/SmartTableSizeSetting.vue';
import { SmartTableCode } from '../constant';
import {
  VxeTableToolButtonCustomRenderer,
  VxeTableToolComponentRenderer,
  VxeTableToolVxeButtonRenderer,
} from '../types/SmartTableRenderType';
import { AddIcon, editIcon } from '../utils';
//
// interface Action extends SmartTableActions {
// }

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
      name: VxeTableToolButtonCustomRenderer,
    },
    code: 'ModalAdd',
    name: t('smartTable.button.add'),
    props: {
      icon: h(AddIcon, {
        class: ['anticon'],
      }),
      type: 'primary',
    },
  };
};

const getDefaultEditButtonConfig = (
  t: (args: string) => string,
): SmartTableButton => {
  return {
    buttonRender: {
      name: VxeTableToolButtonCustomRenderer,
    },
    code: 'ModalEdit',
    name: t('smartTable.button.edit'),
    props: {
      icon: h(editIcon, {
        class: ['anticon'],
      }),
      type: 'primary',
    },
  };
};

const getDefaultDeleteButtonConfig = (
  t: (args: string) => string,
): SmartTableButton => {
  return {
    buttonRender: {
      name: VxeTableToolButtonCustomRenderer,
    },
    code: 'delete',
    name: t('smartTable.button.delete'),
    props: {
      danger: true,
      icon: h(createIconifyIcon('ant-design:delete-outlined'), {
        class: ['anticon'],
      }),
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
      name: VxeTableToolButtonCustomRenderer,
    },
    code: useYn ? 'useYnTrue' : 'useYnFalse',
    name: useYn ? t('smartTable.common.use') : t('smartTable.common.noUse'),
    props: {
      danger: !useYn,
      icon: h(createIconifyIcon(icon), {
        class: ['anticon'],
      }),
      type: 'primary',
    },
  };
};

export const useSmartTableToolbar = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  getSmartTableContext: SmartTableContextHandler,
  t: (args: string) => string,
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
        return merge({ size: buttonSize }, getDefaultAddButtonConfig(t), {
          item,
          props: {
            onClick: () => {
              showAddModal();
            },
          },
        }) as SmartTableButton;
      }
      if (code === 'ModalEdit') {
        return merge(
          { size: buttonSize },
          getDefaultEditButtonConfig(t),
          {
            props: {
              onClick: () => {
                editByCheckbox();
              },
            },
          },
          item,
        ) as SmartTableButton;
      }
      if (code === 'delete') {
        return merge(
          { size: buttonSize },
          getDefaultDeleteButtonConfig(t),
          {
            props: {
              onClick: () => {
                deleteByCheckbox && deleteByCheckbox();
              },
            },
          },
          item,
        ) as SmartTableButton;
      }
      if (code === 'useYnTrue' || code === 'useYnFalse') {
        const useYn = item.code === 'useYnTrue';
        return merge(
          { size: buttonSize },
          getDefaultUseYnButtonConfig(t, useYn),
          {
            props: {
              onClick: () => {
                setUseYnByCheckbox && setUseYnByCheckbox(useYn);
              },
            },
          },
          item,
        ) as SmartTableButton;
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
    const { authHandler, displayMode, toolbar } = authConfig;
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
        const { auth, code } = button;
        const configAuth = code && toolbar ? (toolbar as any)[code] : undefined;
        if (auth && configAuth) {
          console.warn(
            'toolbarConfig与AuthConfig权限配置冲突，toolbarConfig配置',
          );
        }
        const buttonAuth = auth || configAuth;
        if (!buttonAuth) {
          return button;
        }
        const hasAuth = authHandler(buttonAuth);
        if (hasAuth) {
          return button;
        }
        return displayMode === 'hide'
          ? null
          : {
              ...button,
              props: {
                ...unref(button.props),
                disabled: true,
              },
            };
      })
      .filter((item) => item !== null) as SmartTableButton[];
  };

  const getDefaultRefreshConfig = (): VxeToolbarPropTypes.Refresh => {
    const { query } = getSmartTableContext();
    return {
      queryMethod: (params) => {
        return query(params);
      },
    };
  };

  const convertRefresh = (
    config: undefined | VxeToolbarPropTypes.Refresh,
  ): undefined | VxeToolbarPropTypes.Refresh => {
    if (!config) {
      return undefined;
    }
    if (isBoolean(config)) {
      return getDefaultRefreshConfig();
    }
    return {
      ...(getDefaultRefreshConfig() as any),
      ...config,
    };
  };

  const convertSizeSettingConfig = (
    sizeSetting: boolean | SmartTableToolbarSizeSetting,
  ): SmartTableToolbarTool => {
    return {
      code: SmartTableCode.sizeSetting,
      component: SmartTableSizeSetting,
      toolRender: {
        name: VxeTableToolComponentRenderer,
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
    const result: SmartTableToolbarTool[] = [...(tools || [])];
    if (showSearch && unref(tableProps).useSearchForm) {
      if (isBoolean(showSearch)) {
        const {
          tableInnerContext: { computedSearchFormVisible },
        } = getSmartTableContext();
        const props = computed(() => {
          return {
            circle: true,
            icon: 'vxe-icon-search',
            title: unref(computedSearchFormVisible)
              ? t('component.table.hideSearch')
              : t('component.table.showSearch'),
          };
        });
        result.push({
          code: SmartTableCode.showSearch,
          props,
          toolRender: {
            name: VxeTableToolVxeButtonRenderer,
          },
        });
      } else {
        result.push(showSearch);
      }
    }
    // 处理列配置
    if (column) {
      const columnConfig = isBoolean(column) ? undefined : column;
      const {
        tableInnerAction: { setColumnSortConfig },
      } = getSmartTableContext();
      result.push({
        code: SmartTableCode.column,
        component: SmartTableColumnConfig,
        toolRender: {
          name: VxeTableToolComponentRenderer,
          props: {
            config: columnConfig,
            setColumnSortConfig,
          },
        },
      });
    }
    if (sizeSetting) {
      result.push(convertSizeSettingConfig(sizeSetting));
    }
    return result;
  };

  const computedToolBarRefresh = computed<
    undefined | VxeToolbarPropTypes.Refresh
  >(() => {
    const { toolbarConfig } = unref(tableProps);
    return convertRefresh(toolbarConfig?.refresh);
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
      refresh: unref(computedToolBarRefresh),
      tools: unref(computedToolbarTools),
    };
  });

  return {
    computedToolbarConfig,
  };
};
