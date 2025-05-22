import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import { h } from 'vue';

import VXETable from 'vxe-table';

import { SmartTableToolbarComponentRenderer } from '../../types/SmartTableRenderType';

export default function smartTableToolbarComponentRenderer() {
  VXETable.renderer.add(SmartTableToolbarComponentRenderer, {
    renderToolbarTool(
      { props }: VxeGlobalRendererHandles.RenderToolOptions,
      { tool }: VxeGlobalRendererHandles.RenderToolParams,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      return h((tool as any).component, props);
    },
  });
}
