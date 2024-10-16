import type { SmartTableActions, SmartTableStoreData } from './types';

import { Store } from '@vben-core/shared/store';
import {
  bindMethods,
  isFunction,
  mergeWithArrayOverride,
  StateHandler,
} from '@vben-core/shared/utils';

function getDefaultState(): SmartTableStoreData {
  return {};
}

class SmartTableApi {
  // private prevState: null | SmartTableStoreData = null;

  // 是否挂在
  isMounted = false;
  public state: null | SmartTableStoreData = null;

  stateHandler: StateHandler;

  public store: Store<SmartTableStoreData>;

  public table = {} as SmartTableActions;

  constructor(options: SmartTableStoreData = {}) {
    const { ...storeState } = options;
    const defaultState = getDefaultState();

    this.store = new Store<SmartTableStoreData>(
      {
        ...defaultState,
        ...storeState,
      },
      {
        onUpdate: () => {
          // this.prevState = this.state;
          this.state = this.store.state;
          this.updateState();
        },
      },
    );

    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  private updateState(): void {}

  /**
   * 设置表单的加载状态
   * @param isLoading
   */
  setLoading(isLoading: boolean) {
    this.setState({
      gridOptions: {
        loading: isLoading,
      },
    });
  }

  setState(
    stateOrFn:
      | ((prev: SmartTableStoreData) => Partial<SmartTableStoreData>)
      | Partial<SmartTableStoreData>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState((prev) => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState((prev) => mergeWithArrayOverride(stateOrFn, prev));
    }
  }

  /**
   * 卸载组件
   */
  unmounted() {
    this.isMounted = false;
    this.stateHandler.reset();
  }
}

export { SmartTableApi };
