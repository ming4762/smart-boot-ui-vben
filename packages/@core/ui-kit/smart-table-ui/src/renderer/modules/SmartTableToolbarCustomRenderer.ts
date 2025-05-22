import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import type { SmartTableButton } from '../../types/SmartTableButtonType';

import { h, unref } from 'vue';

import { VbenButton } from '@vben-core/shadcn-ui';
import { omit } from '@vben-core/shared/utils';

import VXETable from 'vxe-table';

import { SmartTableToolbarCustomRenderer } from '../../types/SmartTableRenderType';
import { getComponent } from '../../utils';

export default function smartTableToolbarCustomRenderer() {
  VXETable.renderer.add(SmartTableToolbarCustomRenderer, {
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
}
