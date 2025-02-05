/**
 * 全局复用的变量、组件、配置，各个模块之间共享
 * 通过单例模式实现,单例必须注意不受请求影响，例如用户信息这些需要根据请求获取的。后续如果有ssr需求，也不会影响
 */

interface ComponentsState {
  [key: string]: any;
}

interface MessageState {
  confirm?: (options: any) => any;
  copyPreferencesSuccess?: (title: string, content?: string) => void;
  error?: (options: any) => any;
  success?: (options: any) => any;
  warning?: (options: any) => any;
}

export interface IGlobalSharedState {
  components: ComponentsState;
  message: MessageState;
}

class GlobalShareState {
  #components: ComponentsState = {};
  #message: MessageState = {};

  /**
   * 定义框架内部各个场景的消息提示
   */
  public defineMessage(messageState: Partial<MessageState>) {
    this.#message = {
      ...this.#message,
      ...messageState,
    };
  }

  public getComponent(key: string): any {
    return this.#components[key];
  }

  public getComponents(): ComponentsState {
    return this.#components;
  }

  public getMessage(): MessageState {
    return this.#message;
  }

  public setComponents(value: ComponentsState) {
    this.#components = value;
  }
}

export const globalShareState = new GlobalShareState();
