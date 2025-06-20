import SmartTableToolbarComponentRenderer from './modules/SmartTableToolbarComponentRenderer';
import SmartTableToolbarCustomRenderer from './modules/SmartTableToolbarCustomRenderer';
import SmartTableToolbarSlotRenderer from './modules/SmartTableToolbarSlotRenderer';
import SmartTableToolbarVxeButtonRenderer from './modules/SmartTableToolbarVxeButtonRenderer';

export const initSmartTableRender = () => {
  const handers = [
    SmartTableToolbarComponentRenderer,
    SmartTableToolbarCustomRenderer,
    SmartTableToolbarSlotRenderer,
    SmartTableToolbarVxeButtonRenderer,
  ];
  for (const handler of handers) {
    handler();
  }
};
