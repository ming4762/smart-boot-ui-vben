import type { Component } from 'vue';

import type { SmartAuthType } from '@vben-core/typings';

import type { SmartTableSize } from '../types';

import { DEFAULT_SETUP_HANDLER } from '../init';

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
const getComponent = (
  componentName: string,
): Component | string | undefined => {
  return DEFAULT_SETUP_HANDLER.getComponent(componentName);
};

const successMessage = (message: string) =>
  DEFAULT_SETUP_HANDLER.messageHandler.success(message);
const warningMessage = (message: string) =>
  DEFAULT_SETUP_HANDLER.messageHandler.warning(message);
const errorMessage = (message: string) =>
  DEFAULT_SETUP_HANDLER.messageHandler.error(message);
const confirmModal = (option: Record<string, any>) =>
  DEFAULT_SETUP_HANDLER.messageHandler.confirm(option);

const hasPermission = (code?: SmartAuthType) =>
  DEFAULT_SETUP_HANDLER.hasPermission(code);

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
