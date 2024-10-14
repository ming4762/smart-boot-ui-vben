import type { VxeTablePropTypes } from 'vxe-table';

import type { Component } from 'vue';

import { COMPONENT_MAP } from '../init';

const FormSizeMap: Record<string, 'default' | 'large' | 'small'> = {
  midum: 'default',
  mini: 'small',
  small: 'small',
  tiny: 'small',
};

/**
 * 获取form尺寸
 * @param size
 */
const getFormSize = (
  size: undefined | VxeTablePropTypes.Size,
): 'default' | 'large' | 'small' | undefined => {
  if (size) {
    return FormSizeMap[size];
  }
  return undefined;
};

/**
 * 获取组件
 * @param componentName  组件名称
 */
const getComponent = (componentName: string): Component | undefined => {
  return COMPONENT_MAP[componentName];
};

export { getComponent, getFormSize };
