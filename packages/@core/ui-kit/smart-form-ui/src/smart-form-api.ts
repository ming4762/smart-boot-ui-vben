import type { SmartFormActionType, SmartFormProps } from './types';

import { Store } from '@vben-core/shared/store';
import { bindMethods, StateHandler } from '@vben-core/shared/utils';

const getDefaultState = (): SmartFormProps => {
  return {};
};

export class SmartFormApi {
  private prevState: null | SmartFormProps = null;

  public form = {} as SmartFormActionType;
  isMounted = false;

  public state: null | SmartFormProps = null;

  stateHandler: StateHandler;

  public store: Store<SmartFormProps>;

  constructor(options: SmartFormProps = {}) {
    const { ...storeState } = options;
    const defaultState = getDefaultState();

    this.store = new Store<SmartFormProps>(
      {
        ...defaultState,
        ...storeState,
      },
      {
        onUpdate: () => {
          this.prevState = this.state;
          this.state = this.store.state;
          this.updateState();
        },
      },
    );
    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  private async getForm() {
    if (!this.isMounted) {
      // 等待form挂载
      await this.stateHandler.waitForCondition();
    }
    if (!this.form?.meta) {
      throw new Error('<SmartForm /> is not mounted');
    }
    return this.form;
  }

  private updateState() {
    const currentSchema = this.state?.schema ?? [];
    const prevSchema = this.prevState?.schema ?? [];
    // 进行了删除schema操作
    if (currentSchema.length < prevSchema.length) {
      const currentFields = new Set(
        currentSchema.map((item) => item.fieldName),
      );
      const deletedSchema = prevSchema.filter(
        (item) => !currentFields.has(item.fieldName),
      );

      for (const schema of deletedSchema) {
        this.form?.setFieldValue(schema.fieldName, undefined);
      }
    }
  }

  // 如果需要多次更新状态，可以使用 batch 方法
  batchStore(cb: () => void) {
    this.store.batch(cb);
  }

  getState() {
    return this.state;
  }
}
