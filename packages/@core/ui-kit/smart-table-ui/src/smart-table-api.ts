import type { SmartTableAction, SmartTableProps } from './types';

import { Store } from '@vben-core/shared/store';
import {
  bindMethods,
  isFunction,
  mergeWithArrayOverride,
  StateHandler,
} from '@vben-core/shared/utils';

function getDefaultState(): SmartTableProps {
  return {};
}

class SmartTableApi {
  // 是否挂在
  isMounted = false;
  // private prevState: null | SmartTableStoreData = null;
  public smartTableAction: SmartTableAction = {};

  public state: null | SmartTableProps = null;

  stateHandler: StateHandler;

  public store: Store<SmartTableProps>;

  constructor(options: SmartTableProps = {}) {
    const { ...storeState } = options;
    const defaultState = getDefaultState();

    this.store = new Store<SmartTableProps>(
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

  mount(tableAction: SmartTableAction) {
    if (!this.isMounted && tableAction.getGrid) {
      this.smartTableAction = tableAction;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
      Object.assign(this, tableAction);
    }
  }

  setState(
    stateOrFn:
      | ((prev: SmartTableProps) => Partial<SmartTableProps>)
      | Partial<SmartTableProps>,
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
