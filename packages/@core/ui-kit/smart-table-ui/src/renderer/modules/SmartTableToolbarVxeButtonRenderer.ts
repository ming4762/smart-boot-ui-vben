import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import { h, unref } from 'vue';

import { VxeButton } from 'vxe-pc-ui';
import VXETable from 'vxe-table';

import { SmartTableToolbarVxeButtonRenderer } from '../../types/SmartTableRenderType';

export default function smartTableToolbarVxeButtonRenderer() {
  VXETable.renderer.add(SmartTableToolbarVxeButtonRenderer, {
    renderToolbarTool(
      _: VxeGlobalRendererHandles.RenderToolOptions,
      params: VxeGlobalRendererHandles.RenderToolParams<any>,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      const { $grid, tool } = params;
      const props = unref((tool as any).props);
      const handleClick = (event: MouseEvent) => {
        ($grid as any)?.triggerToolbarTolEvent(tool, event);
      };
      return h(VxeButton, {
        ...props,
        onClick: (event: MouseEvent) => handleClick(event),
      });
    },
  });
}
