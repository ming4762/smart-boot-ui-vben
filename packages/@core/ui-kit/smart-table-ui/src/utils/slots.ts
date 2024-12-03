import type { SmartTableBasicFormConfig } from '../types/SmartTableCommon';

import type { Slot, Slots } from 'vue';

import { isString } from '@vben-core/shared/utils';

/**
 * 获取表单的 slots
 * @param formConfig
 * @param slots
 */
const getFormSlots = (
  slots: Slots,
  formConfig?: SmartTableBasicFormConfig,
): Record<string, Slot | undefined> => {
  if (!formConfig) {
    return {};
  }
  const configFormSlots = formConfig?.slots;
  const formSlots: Record<string, Slot | undefined> = {};

  if (configFormSlots) {
    if (Array.isArray(configFormSlots)) {
      configFormSlots.forEach((item) => {
        formSlots[item] = slots[item];
      });
    } else {
      for (const key of Object.keys(configFormSlots)) {
        const value = configFormSlots[key];
        if (!value) {
          continue;
        }
        formSlots[key] = isString(value) ? slots[key] : (value as never);
      }
    }
  }

  // 处理 column slots
  const columnSlots: Record<string, Slot | undefined> = {};
  const schemaList = formConfig?.schema || [];
  schemaList
    .map((item) => item.slot)
    .filter((item) => item !== undefined)
    .forEach((item) => {
      columnSlots[item] = slots[item];
    });
  const result = {
    ...formSlots,
    ...columnSlots,
  };
  if (
    Object.keys(formSlots).length + Object.keys(columnSlots).length >
    Object.keys(result).length
  ) {
    throw new Error('表单插槽命名重复');
  }
  return result;
};

export { getFormSlots };
