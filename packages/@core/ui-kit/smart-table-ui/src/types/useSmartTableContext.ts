import type { Nullable } from '@vben-core/typings';

import type { SmartTableActions, SmartTableProps } from './index';
import type { SmartTableInnerActionType } from './SmartTableActionType';

import { type ComputedRef, inject, provide, type Ref } from 'vue';

type Instance = {
  getBindValues: ComputedRef<Record<string, any>>;
  t: (key: string, args?: any) => string;
  tableInnerAction: SmartTableInnerActionType;
  wrapRef: Ref<Nullable<HTMLElement>>;
} & SmartTableActions;

type RetInstance = {
  getBindValues: ComputedRef<SmartTableProps>;
} & Omit<Instance, 'getBindValues'>;

const key = Symbol('smart-table');

const ACTIONS = {
  [key]: {} as RetInstance,
};

function createSmartTableContext(instance: Instance) {
  ACTIONS[key] = instance;
  provide(key, instance);
}

function useSmartTableContext(): RetInstance {
  return ACTIONS[key];
}

function injectSmartTableContext(): RetInstance {
  return inject(key) as RetInstance;
}

export {
  createSmartTableContext,
  injectSmartTableContext,
  useSmartTableContext,
};
