import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import type { SmartTableButton } from '../types/SmartTableButtonType';

import { h, unref } from 'vue';

import { VbenButton } from '@vben-core/shadcn-ui';

import VXETable from 'vxe-table';

import { VxeTableToolButtonCustomRenderer } from '../types/SmartTableRenderType';
import { getComponent } from '../utils';

export const initButtonRenderer = (): void => {
  VXETable.renderer.add(VxeTableToolButtonCustomRenderer, {
    renderToolbarButton(
      _: VxeGlobalRendererHandles.RenderButtonOptions,
      params: VxeGlobalRendererHandles.RenderButtonParams,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      const button = params.button as SmartTableButton;
      const buttonPros = {
        ...button,
        ...unref(button.props),
      };
      delete buttonPros.props;
      delete buttonPros.buttonRender;
      const component = getComponent('Button') || VbenButton;
      return h(component, buttonPros, {
        default: () => buttonPros.name,
      });
    },
  });
};
