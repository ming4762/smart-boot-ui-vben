import { watch } from 'vue';
import { useRoute } from 'vue-router';

import WujieVue from 'wujie-vue3';

import { getMicroBus } from '#/micro-app';

const MICRO_ROUTER_BUS_EVENT = 'micro-bus-router-change';

interface MicroRouteChangeEvent {
  fullPath: string;
  name: string;
  path: string;
  query: Record<string, any>;
}

/**
 * 主应用路由变化事件
 */
export const useEmitMainRouteChange = (name: string) => {
  const route = useRoute();
  watch(route, () => {
    const event: MicroRouteChangeEvent = {
      fullPath: route.fullPath,
      path: route.path,
      query: route.query,
      name,
    };
    WujieVue.bus.$emit(MICRO_ROUTER_BUS_EVENT, event);
  });
};

/**
 * 微应用路由变化事件
 */
export const useOnMicroRouteChange = () => {
  getMicroBus()?.$on(MICRO_ROUTER_BUS_EVENT, (_event: MicroRouteChangeEvent) => {
    // todo
    // console.log(event);
  });
};
