import type { Recordable } from '@vben/types';

import type { DeepReadonly, Ref, UnwrapRef, WritableComputedRef } from 'vue';
import {
  computed,
  getCurrentInstance,
  nextTick,
  reactive,
  readonly,
  toRaw,
  unref,
  watchEffect,
} from 'vue';

import { deepEqual } from '@vben/utils';

export function useRuleFormItem<
  T extends Recordable<any>,
  K extends keyof T,
  V = UnwrapRef<T[K]>,
>(
  props: T,
  key?: K,
  changeEvent?: any,
  emitData?: Ref<any[]>,
): [WritableComputedRef<V>, (val: V) => void, DeepReadonly<V>];

export function useRuleFormItem<T extends Recordable<any>>(
  props: T,
  key: keyof T = 'value',
  changeEvent = 'change',
  emitData?: Ref<any[]>,
) {
  const instance = getCurrentInstance();
  const emit = instance?.emit;

  const innerState = reactive({
    value: props[key],
  });

  const defaultState = readonly(innerState);

  const setState = (val: UnwrapRef<T[keyof T]>): void => {
    innerState.value = val as T[keyof T];
  };

  watchEffect(() => {
    innerState.value = props[key];
  });

  const state: any = computed({
    get() {
      return innerState.value;
    },
    set(value) {
      if (deepEqual(value, defaultState.value)) return;

      innerState.value = value as T[keyof T];
      nextTick(() => {
        emit?.(changeEvent, value, ...(toRaw(unref(emitData)) || []));
      });
    },
  });

  return [state, setState, defaultState];
}
