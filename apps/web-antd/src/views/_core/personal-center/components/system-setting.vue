<script setup lang="ts">
import { computed, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $ct as t } from '@vben/locales';

import { List } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { SmartIconButton } from '#/components';
import { useUserProfileStore } from '#/store';

import Container from './container.vue';
import TimeZoneSetModal from './time-zone-set-modal.vue';

const ListItem = List.Item;
const ListItemMeta = List.Item.Meta;

const { timeZone } = storeToRefs(useUserProfileStore());

/**
 * 时区设置
 */
const [RenderTimeZoneSetModal, timeZoneSetModalApi] = useVbenModal({
  connectedComponent: TimeZoneSetModal,
});
const handleSetTimeZone = () => {
  timeZoneSetModalApi.open();
};

const handleAction = (key: string) => {
  if (key === 'timeZone') {
    handleSetTimeZone();
  }
};

const computedConfigValue = computed<Record<string, any>>(() => {
  return {
    timeZone: unref(timeZone),
  };
});

const configList = [
  {
    title: t('ui.widgets.personalCenter.systemSetting.timeZone'),
    description: t(
      'ui.widgets.personalCenter.systemSetting.timeZoneDescription',
    ),
    key: 'timeZone',
    actionName: t('common.edit'),
  },
  {
    title: t('ui.widgets.personalCenter.systemSetting.tenant'),
    description: t('ui.widgets.personalCenter.systemSetting.tenantDescription'),
    key: 'tenant',
    actionName: t('common.edit'),
  },
];
</script>

<template>
  <Container
    class="system-setting h-full"
    :title="t('ui.widgets.personalCenter.systemSetting.title')"
  >
    <List>
      <template v-for="item in configList" :key="item.key">
        <ListItem>
          <ListItemMeta>
            <template #title>
              {{ item.title }}
              <div
                class="action text-font-normal text-primary float-right mr-[30px] mt-[10px] cursor-pointer"
                v-if="item.actionName"
              >
                <SmartIconButton
                  @click="() => handleAction(item.key)"
                  type="link"
                >
                  {{ item.actionName }}
                </SmartIconButton>
              </div>
            </template>
            <template #description>
              <div>
                {{ item.description }}{{ computedConfigValue[item.key] }}
              </div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
    <!--  时区设置modal  -->
    <RenderTimeZoneSetModal />
  </Container>
</template>

<style scoped></style>
