/**
 * 判断是否是wujie微应用
 * @returns 是否是wujie微应用
 */
export const isMicroApp = () => {
  const wujieWindow: any = window;
  return wujieWindow.__POWERED_BY_WUJIE__ === true;
};

/**
 * 获取wujie微应用的props
 * @returns wujie微应用的props
 */
export const getProps = () => {
  return (window as any).$wujie?.props;
};

/**
 * 获取wujie微应用的路由处理函数
 * 用于从父应用获取子应用的路由处理函数
 * @returns wujie微应用的路由处理函数
 */
export const getRouterHandler = () => {
  return getProps()?.routerHandler;
};

/**
 * 获取wujie微应用的事件总线
 * @returns wujie微应用的事件总线
 */
export const getMicroBus = () => {
  return (window as any).$wujie?.bus;
};
