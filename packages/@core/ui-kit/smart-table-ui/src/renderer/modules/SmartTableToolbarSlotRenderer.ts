import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import type {
  SmartTableButton,
  SmartTableToolbarTool,
} from '../../types/SmartTableButtonType';

import { isString } from '@vben-core/shared/utils';

import VXETable from 'vxe-table';

import { SmartTableToolbarSlotRenderer } from '../../types/SmartTableRenderType';

/**
 * 添加toolbar按钮插槽渲染器
 * @author zhongming4762
 */
export default function smartTableToolbarSlotRenderer() {
  VXETable.renderer.add(SmartTableToolbarSlotRenderer, {
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
    renderToolbarTool(
      _: VxeGlobalRendererHandles.RenderToolOptions,
      { tool }: VxeGlobalRendererHandles.RenderToolParams<any>,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      const { slot } = tool as SmartTableToolbarTool;
      if (!slot || isString(slot)) {
        return '';
      }
      return slot(tool);
    },
  });
}
