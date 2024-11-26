import type { SmartTableSize } from '../types';
import type { SmartTableAuth } from '../types/SmartTableAuthType';

import type { Component } from 'vue';

import { COMPONENT_MAP, MESSAGE_HANDLER, PERMISSION_HANDLE } from '../init';

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
  size: SmartTableSize | undefined,
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

const successMessage = (message: string) => MESSAGE_HANDLER.success(message);
const warningMessage = (message: string) => MESSAGE_HANDLER.warning(message);
const errorMessage = (message: string) => MESSAGE_HANDLER.error(message);
const confirmModal = (option: Record<string, any>) =>
  MESSAGE_HANDLER.confirm(option);

const hasPermission = (code?: SmartTableAuth) =>
  PERMISSION_HANDLE.hasPermission(code);

export {
  confirmModal,
  errorMessage,
  getComponent,
  getFormSize,
  hasPermission,
  successMessage,
  warningMessage,
};

export * from './buttons';
