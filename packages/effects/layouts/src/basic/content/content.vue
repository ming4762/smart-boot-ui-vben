<script lang="ts" setup>
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';

import { inject, unref } from 'vue';
import { RouterView } from 'vue-router';

import { SmartPageProvider, usePreferences } from '@vben/preferences';
import { getTabKey, storeToRefs, useTabbarStore } from '@vben/stores';

import { transformComponent, useLayoutHook } from '../../hooks';
import { IFrameRouterView } from '../../iframe';
import { RouteCachedPage, RouteCachedView } from '../../route-cached';

defineOptions({ name: 'LayoutContent' });

const tabbarStore = useTabbarStore();
const { keepAlive } = usePreferences();

const { getCachedTabs, getExcludeCachedTabs, renderRouteView } =
  storeToRefs(tabbarStore);

const { getEnabledTransition, getTransitionName } = useLayoutHook();

const dictApi = inject<(args: any) => Promise<any>>('dict-api', () =>
  Promise.resolve({}),
);
/*
 * 是否显示component
 * @param route
 */
const showComponent = (route: RouteLocationNormalizedLoadedGeneric) => {
  return !route.meta.domCached && unref(renderRouteView);
};
</script>

<template>
  <div class="relative h-full overflow-y-auto">
    <IFrameRouterView />
    <RouteCachedView />
    <RouterView v-slot="{ Component, route }">
      <RouteCachedPage
        :component="Component"
        :route="route"
        v-if="route.meta.domCached"
      />
      <SmartPageProvider :api="dictApi">
        <Transition
          v-if="getEnabledTransition"
          :name="getTransitionName(route)"
          appear
          mode="out-in"
        >
          <KeepAlive
            v-if="keepAlive"
            :exclude="getExcludeCachedTabs"
            :include="getCachedTabs"
          >
            <component
              :is="transformComponent(Component, route)"
              v-if="showComponent(route)"
              v-show="!route.meta.iframeSrc"
              :key="getTabKey(route)"
            />
          </KeepAlive>
          <component
            :is="Component"
            v-else-if="showComponent(route)"
            :key="getTabKey(route)"
          />
        </Transition>
        <template v-else>
          <KeepAlive
            v-if="keepAlive"
            :exclude="getExcludeCachedTabs"
            :include="getCachedTabs"
          >
            <component
              :is="transformComponent(Component, route)"
              v-if="showComponent(route)"
              v-show="!route.meta.iframeSrc"
              :key="getTabKey(route)"
            />
          </KeepAlive>
          <component
            :is="Component"
            v-else-if="showComponent(route)"
            :key="getTabKey(route)"
          />
        </template>
      </SmartPageProvider>
    </RouterView>
  </div>
</template>
