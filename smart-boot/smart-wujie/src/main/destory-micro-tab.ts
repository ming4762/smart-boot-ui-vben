import type { TabDefinition } from '@vben/types';

import { toRefs, watch } from 'vue';

import { useTabbarStore } from '@vben/stores';

import WujieVue from 'wujie-vue3';

export const destoryMicroTab = () => {
  const { getTabs } = toRefs(useTabbarStore());

  watch(getTabs, (newTabs, oldTabs) => {
    destroyMicroTab(newTabs, oldTabs);
  });
};

const destroyMicroTab = (
  newTabs: TabDefinition[],
  oldTabs: TabDefinition[],
) => {
  const oldMicroNames = getMicroName(oldTabs);
  if (oldMicroNames.length === 0) {
    return;
  }
  const newMicroNameSet = new Set(getMicroName(newTabs));
  const removedMicroNames: string[] = [...new Set(oldMicroNames)].filter(
    (oldName) => {
      return !newMicroNameSet.has(oldName);
    },
  );
  if (removedMicroNames.length === 0) {
    return;
  }
  removedMicroNames.forEach((name) => {
    WujieVue.destroyApp(name);
  });
};

const getMicroName = (tabs: TabDefinition[]) => {
  return tabs
    .map((tab) => {
      return (tab.meta?.microFrontendConfig || ({} as any)).name;
    })
    .filter((name) => name !== undefined) as string[];
};
