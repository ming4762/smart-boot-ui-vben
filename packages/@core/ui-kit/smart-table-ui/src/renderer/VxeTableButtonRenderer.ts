import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import type { SmartTableButton } from '../types/SmartTableButtonType';

import { h, unref } from 'vue';

import { VbenButton } from '@vben-core/shadcn-ui';
import { isString, omit } from '@vben-core/shared/utils';

import VXETable from 'vxe-table';

import {
  VxeTableToolButtonCustomRenderer,
  VxeTableToolButtonSlotRenderer,
} from '../types/SmartTableRenderType';
import { getComponent } from '../utils';

export const initButtonRenderer = (): void => {
  VXETable.renderer.add(VxeTableToolButtonCustomRenderer, {
    renderToolbarButton(
      _: VxeGlobalRendererHandles.RenderButtonOptions,
      params: VxeGlobalRendererHandles.RenderButtonParams,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      const button = params.button as SmartTableButton;
      let buttonPros = {
        ...button,
        ...unref(button.props),
      };
      const hasAuth = unref(button.props)?.hasAuth;
      buttonPros = omit(buttonPros, ['props', 'buttonRender']);
      const component = getComponent('IconButton') || VbenButton;

      if (hasAuth === false) {
        const tooltipComponent = getComponent('Tooltip');
        if (!tooltipComponent) {
          throw new Error('Please install the tooltip component');
        }
        return h(
          tooltipComponent,
          {
            color: 'red',
            title: VXETable.getI18n('smartTable.message.noPermission'),
          },
          {
            default: () =>
              h(component, buttonPros, {
                default: () => buttonPros.name,
              }),
          },
        );
      } else {
        return h(component, buttonPros, {
          default: () => buttonPros.name,
        });
      }
    },
  });

  // 添加插槽渲染器
  VXETable.renderer.add(VxeTableToolButtonSlotRenderer, {
    renderToolbarButton(
      _: VxeGlobalRendererHandles.RenderButtonOptions,
      params: VxeGlobalRendererHandles.RenderButtonParams<any>,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      const button = params.button as SmartTableButton;
      if (!button.slot || isString(button.slot)) {
        return '';
      }
      return button.slot(button);
    },
  });
};
