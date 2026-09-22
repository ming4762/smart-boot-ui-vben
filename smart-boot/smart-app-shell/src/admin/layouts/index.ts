const BasicLayout = () => import('./basic.vue');
const IFrameView = () =>
  import('@vben/layouts').then((module) => module.IFrameView);

export { BasicLayout, IFrameView };
