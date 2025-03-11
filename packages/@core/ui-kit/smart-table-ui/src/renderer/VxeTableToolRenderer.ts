import type { VxeComponentSlotType, VxeGlobalRendererHandles } from 'vxe-table';

import { h, unref } from 'vue';

import { VxeButton } from 'vxe-pc-ui';
import VXETable from 'vxe-table';

import {
  VxeTableToolComponentRenderer,
  VxeTableToolVxeButtonRenderer,
} from '../types/SmartTableRenderType';

export const initToolRenderer = () => {
  VXETable.renderer.add(VxeTableToolVxeButtonRenderer, {
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

  VXETable.renderer.add(VxeTableToolComponentRenderer, {
    renderToolbarTool(
      { props }: VxeGlobalRendererHandles.RenderToolOptions,
      { tool }: VxeGlobalRendererHandles.RenderToolParams,
    ): VxeComponentSlotType | VxeComponentSlotType[] {
      return h((tool as any).component, props);
    },
  });
};
