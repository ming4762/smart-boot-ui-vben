interface SmartFormProviderProps {
  /**
   * 是否自动提交
   */
  autoSubmitOnEnter?: boolean;
}

interface SmartModalProviderProps {
  // 点击蒙层是否允许关闭
  maskClosable?: boolean;
}

/**
 * APP配置
 */
interface SmartAppProviderProps {
  form?: SmartFormProviderProps;
  modal?: SmartModalProviderProps;
}

export { SmartAppProviderProps };
