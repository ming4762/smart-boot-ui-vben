<script setup lang="ts">
import { unref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useSmartTable } from '@vben/common-ui';

import { listClientApi } from '../SsoClientUserAcess.api';
import { getClientTableColumns } from '../SsoClientUserAcess.config';

interface Props {
  clientId?: number | string;
}
const props = defineProps<Props>();

const router = useRouter();

const goTo = (row?: any) => {
  const currentRoute = unref(router.currentRoute);
  const { clientType, id: clientId } = row;
  const query = {
    ...currentRoute.query,
    clientId,
    clientType,
  };
  router.push({
    path: currentRoute.path,
    query,
  });
};

const setCurrentRow = () => {
  const clientId = props.clientId;
  tableApi.getGrid()?.clearCurrentRow();
  tableApi.getGrid()?.clearCheckboxRow();
  if (clientId) {
    const hasRow = tableApi
      .getGrid()
      .getData()
      .some((item) => item.id.toString() === clientId.toString());
    if (!hasRow) {
      goTo();
    }
    tableApi.getGrid()?.setCurrentRow({ id: clientId });
    tableApi.getGrid()?.setCheckboxRow({ id: clientId }, true);
  }
};
watch(
  () => props.clientId,
  () => {
    setCurrentRow();
  },
);

const [SmartTable, tableApi] = useSmartTable({
  id: 'sso_client_user_access_client_list',
  columns: getClientTableColumns(),
  height: 'auto',
  border: true,
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'id',
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: false,
  useSearchForm: true,
  searchFormConfig: {
    schema: [
      {
        label: '名称',
        fieldName: 'clientName',
        component: 'Input',
        searchSymbol: 'like',
      },
    ],
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '120px',
        },
      },
      labelWidth: 40,
    },
    searchWithSymbol: true,
    actionWrapperClass: 'gap-1',
    compact: true,
    layout: 'inline',
  },
  proxyConfig: {
    ajax: {
      query: (params) => listClientApi(params.ajaxParameter),
    },
  },
});

const handlerCurrentChange = ({ row }: any) => {
  goTo(row);
};
</script>

<template>
  <SmartTable
    @proxy-query="setCurrentRow"
    @current-change="handlerCurrentChange"
  />
</template>

<style scoped></style>
