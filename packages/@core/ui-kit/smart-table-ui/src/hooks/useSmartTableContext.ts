import type { SmartTableContext } from '../types/SmartTableInnerType';

import { inject, provide } from 'vue';

const key = Symbol('smart-table');

function createSmartTableContext(instance: SmartTableContext) {
  provide(key, instance);
}

function injectSmartTableContext(): SmartTableContext {
  return inject(key) as SmartTableContext;
}

export { createSmartTableContext, injectSmartTableContext };
