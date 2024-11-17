import type {
  SmartTableActions,
  SmartTableRenderProps,
  SmartTableSize,
} from '../types';
import type { SmartTableButton } from '../types/SmartTableButtonType';

import { computed, h, unref } from 'vue';

import { createIconifyIcon } from '@vben-core/icons';
import { merge } from '@vben-core/shared/utils';

import { VxeTableToolButtonCustomRenderer } from '../types/SmartTableRenderType';
import { AddIcon, editIcon } from '../utils';

interface Action extends SmartTableActions {
  showAddModal: () => void;
}

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

export const useSmartTableToolbar = (
  tableProps: SmartTableRenderProps,
  t: (args: string) => string,
  actions: Action,
) => {
  const convertButtons = (
    buttonList: SmartTableButton[] | undefined,
    tableSize: SmartTableSize | undefined,
  ): SmartTableButton[] | undefined => {
    if (!buttonList) {
      return undefined;
    }
    const buttonSize = tableSize ? tableButtonSizeMap[tableSize] : undefined;
    return buttonList.map((item) => {
      const { code } = item;
      if (code === 'ModalAdd') {
        return merge({ size: buttonSize }, getDefaultAddButtonConfig(t), {
          item,
          props: {
            onClick: () => {
              actions.showAddModal();
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
                // editByCheckbox();
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
                actions.deleteByCheckbox && actions.deleteByCheckbox();
              },
            },
          },
          item,
        ) as SmartTableButton;
      }
      return {};
    });
  };

  const convertButtonAuth = (
    buttonList: SmartTableButton[] | undefined,
  ): SmartTableButton[] | undefined => {
    if (!buttonList) {
      return undefined;
    }
    return buttonList;
  };

  const computedToolbarConfig = computed(() => {
    const { size: tableSize, toolbarConfig } = unref(tableProps);
    if (!toolbarConfig) {
      return undefined;
    }
    let buttons = convertButtons(toolbarConfig.buttons, tableSize);
    buttons = convertButtonAuth(buttons);
    return {
      buttons,
    };
  });

  return {
    computedToolbarConfig,
  };
};
