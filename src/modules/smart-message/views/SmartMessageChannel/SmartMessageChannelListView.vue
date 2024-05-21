<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  import {
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
  } from './SmartMessageChannelListView.config';
  import {
    listApi,
    deleteApi,
    setUseYnApi,
    getByIdApi,
    batchSaveUpdateApi,
    listSmartMessageType1EnumApi,
    listSmartMessageType2EnumApi,
  } from './SmartMessageChannelListView.api';
  import { ref, unref } from 'vue';
  import { warnMessage } from '@/utils/message/SystemNotice';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const messageType1List = ref<Recordable[]>([]);
  const messageType2List = ref<Recordable[]>([]);
  const loadMessageTypeData = async () => {
    messageType1List.value = await listSmartMessageType1EnumApi();
    messageType2List.value = await listSmartMessageType2EnumApi();
  };

  const [registerTable] = useSmartTable({
    id: 'smart-message-channel',
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    customConfig: { storage: true },
    sortConfig: {
      remote: true,
    },
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
      schemas: getSearchFormSchemas(t, messageType1List),
      searchWithSymbol: true,
      colon: true,
      compact: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
    },
    addEditConfig: {
      formConfig: {
        schemas: getFormSchemas(t, messageType1List, messageType2List),
        compact: true,
        colon: true,
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
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
              result.channelProperties[channelType1][channelType2] = channelProperties;
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
      column: {
        columnOrder: true,
      },
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
