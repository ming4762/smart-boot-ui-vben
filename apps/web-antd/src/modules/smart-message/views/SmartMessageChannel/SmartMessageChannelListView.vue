<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref, unref } from 'vue';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { useSmartTable } from '#/adapter/smart-table';
import { warnMessage } from '#/utils';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  listSmartMessageType1EnumApi,
  listSmartMessageType2EnumApi,
  setUseYnApi,
} from './SmartMessageChannelListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartMessageChannelListView.config';

const { getTableSize } = useSizeSetting();

const messageType1List = ref<Recordable<any>[]>([]);
const messageType2List = ref<Recordable<any>[]>([]);
const loadMessageTypeData = async () => {
  messageType1List.value = await listSmartMessageType1EnumApi();
  messageType2List.value = await listSmartMessageType2EnumApi();
};

const [SmartTable] = useSmartTable({
  id: 'smart-message-channel',
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  customConfig: { storage: true },
  sortConfig: {
    remote: true,
  },
  checkboxConfig: true,
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    schema: getSearchFormSchemas(messageType1List),
    searchWithSymbol: true,
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(messageType1List, messageType2List),
    },
    saveUpdateValidate(isAdd, selectData) {
      if (isAdd) {
        return true;
      }
      if (selectData?.builtInYn === true) {
        warnMessage(t('smart.message.channel.message.builtInValidateMessage'));
        return false;
      }
      return true;
    },
  },
  proxyConfig: {
    ajax: {
      query: async (params) => {
        if (unref(messageType1List).length === 0) {
          await loadMessageTypeData();
        }
        return listApi(params.ajaxParameter);
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const saveDataList = [...insertRecords, ...updateRecords];
        saveDataList.forEach((item) => {
          const { channelType1, channelType2 } = item;
          let channelProperties = item.channelProperties[channelType1];
          if (channelType2) {
            channelProperties = channelProperties[channelType2];
          }
          item.channelProperties = JSON.stringify(channelProperties);
        });
        return batchSaveUpdateApi(saveDataList);
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const result = await getByIdApi(params.id);
        if (result.channelProperties) {
          const { channelType1, channelType2 } = result;
          const channelProperties = JSON.parse(result.channelProperties);
          result.channelProperties = {};
          if (channelType2) {
            result.channelProperties[channelType1] = {};
            result.channelProperties[channelType1][channelType2] =
              channelProperties;
          } else {
            result.channelProperties[channelType1] = channelProperties;
          }
          return result;
        }
      },
      useYn: setUseYnApi,
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: 'smart:message:channel:save',
      },
      {
        code: 'ModalEdit',
        auth: 'smart:message:channel:update',
      },
      {
        code: 'delete',
        auth: 'smart:message:channel:delete',
      },
      {
        code: 'useYnTrue',
        auth: 'smart:message:channel:setUseYn',
      },
      {
        code: 'useYnFalse',
        auth: 'smart:message:channel:setUseYn',
      },
    ],
  },
});
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable :size="getTableSize as never" />
  </div>
</template>

<style scoped></style>
