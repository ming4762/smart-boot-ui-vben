import type { SmartFormRenderProps, SmartFormSchema } from '../types';

import type { Ref } from 'vue';
import { computed, unref } from 'vue';

import { isNumber } from '@vben-core/shared/utils';

export function useItemLabelWidth(
  schemaItemRef: Ref<SmartFormSchema>,
  propsRef: Ref<SmartFormRenderProps>,
) {
  return computed(() => {
    const schemaItem = unref(schemaItemRef);
    const { labelCol = {}, wrapperCol = {} } = schemaItem.itemProps || {};
    const { disabledLabelWidth, labelWidth } = schemaItem;

    const {
      labelCol: globalLabelCol,
      labelWidth: globalLabelWidth,
      layout,
      wrapperCol: globWrapperCol,
    } = unref(propsRef);

    // If labelWidth is set globally, all items setting
    if (
      (!globalLabelWidth && !labelWidth && !globalLabelCol) ||
      disabledLabelWidth
    ) {
      labelCol.style = {
        textAlign: 'left',
      };
      return { labelCol, wrapperCol };
    }
    let width = labelWidth || globalLabelWidth;
    const col = { ...globalLabelCol, ...labelCol };
    const wrapCol = { ...globWrapperCol, ...wrapperCol };

    if (width) {
      width = isNumber(width) ? `${width}px` : width;
    }

    return {
      labelCol: { style: { width }, ...col },
      wrapperCol: {
        style: {
          width: layout === 'vertical' ? '100%' : `calc(100% - ${width})`,
        },
        ...wrapCol,
      },
    };
  });
}
