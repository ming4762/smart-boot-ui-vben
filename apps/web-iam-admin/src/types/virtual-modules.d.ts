declare module 'virtual:smart-modules' {
  import type { Component } from 'vue';

  const SmartModulePageMap: Record<string, () => Promise<Component>>;
  export default SmartModulePageMap;
}
