import type { VxeGridPropTypes } from 'vxe-table';

import type {
  SmartTableActions,
  SmartTableAjaxQueryParams,
  SmartTableFetchParams,
  SmartTableProxyAjax,
  SmartTableRenderProps,
} from '../types';
import type { SmartSearchFormParameter } from '../types/SmartSearchFormType';

import { computed, h, unref } from 'vue';

import { merge } from '@vben-core/shared/utils';

import {
  configModal,
  confirmIcon,
  successMessage,
  warningMessage,
} from '../utils';

interface SearchFormTableAction extends SmartTableActions {
  getSearchFormParameter: () => Promise<SmartSearchFormParameter | undefined>;
}

const useSmartTableAjax = (
  tableProps: SmartTableRenderProps,
  emit: (name: string, ...args: any[]) => void,
  t: (args: string) => string,
  tableAction: SearchFormTableAction,
) => {
  let initQuery = false;

  const computedProxyConfig = computed(() => {
    const { proxyConfig, sortConfig, useSearchForm } = unref(tableProps);
    if (!proxyConfig) {
      return undefined;
    }
    const ajax: SmartTableProxyAjax = proxyConfig.ajax || {};
    let queryAjax: any = {};

    if (ajax.query) {
      queryAjax = {
        query: async (
          params: SmartTableAjaxQueryParams<any>,
          ...args: any[]
        ) => {
          const { $grid, filters, form, page, sort, sorts } =
            params as VxeGridPropTypes.ProxyAjaxQueryParams;
          let fetchParams: SmartTableFetchParams = {};
          if (args && args.length > 0) {
            fetchParams = args[0];
          }
          const searchParameter: SmartTableAjaxQueryParams<any> = merge(
            {
              $grid,
              filters,
              form,
              page,
              sort,
              sorts,
            },
            fetchParams,
          );
          let ajaxParameter: Record<string, any> = {
            ...form,
            ...page,
          };
          // 处理排序
          if (sorts.length > 0 && sortConfig?.remote === true) {
            const sortNameList: string[] = [];
            const sortOrderList: string[] = [];
            for (const item of sorts) {
              sortNameList.push(item.field);
              sortOrderList.push(item.order);
            }
            ajaxParameter.sortName = sortNameList.join(',');
            ajaxParameter.sortOrder = sortOrderList.join(',');
          }
          const {
            noSymbolForm,
            searchForm,
            searchSymbolForm,
            searchWithSymbol,
          } = (await tableAction.getSearchFormParameter()) || {};
          if (useSearchForm) {
            if (searchWithSymbol) {
              // 处理搜索符号
              searchParameter.searchFormSymbol = searchSymbolForm;
              Object.assign(
                ajaxParameter,
                {
                  parameter: searchSymbolForm,
                },
                noSymbolForm,
              );
            } else {
              Object.assign(ajaxParameter, searchForm);
            }
            searchParameter.searchForm = searchForm;
          }
          delete ajaxParameter.total;
          ajaxParameter = merge(ajaxParameter, searchParameter.searchInfo);
          // 添加额外的查询条件
          searchParameter.ajaxParameter = ajaxParameter;
          let result = await ajax.query?.(searchParameter);
          if (proxyConfig.afterLoad) {
            result = proxyConfig.afterLoad(result);
          }
          // 标记已经初始化
          if (!initQuery) {
            initQuery = true;
          }
          return result;
        },
      };
    }
    const sort = sortConfig?.remote === true;
    return {
      props: {
        result: 'rows',
        total: 'total',
      },
      // autoLoad: false,
      sort,
      ...proxyConfig,
      ajax: {
        ...ajax,
        ...queryAjax,
      },
    };
  });

  /**
   * 查询函数
   * @param params
   */
  const query = async (params?: SmartTableFetchParams) => {
    try {
      tableAction.setLoading(true);
      const code = initQuery ? 'query' : '_init';
      tableAction.getGrid().commitProxy(code, params);
      emit('proxy-query', { isInited: false, isReload: false, status: true });
    } finally {
      tableAction.setLoading(false);
    }
  };

  /**
   * 执行删除操作
   * @param rows 需要删除的行
   */
  const doDelete = async (rows: any[]) => {
    const proxyConfig = unref(tableProps).proxyConfig;
    const deleteMethod = proxyConfig?.ajax?.delete;
    if (!deleteMethod) {
      throw new Error('proxyConfig.ajax.delete未配置，无法删除');
    }
    if (rows.length === 0) {
      return false;
    }
    configModal({
      content: t('smartTable.message.deleteConfirm'),
      icon: h(confirmIcon, { class: ['anticon'] }),
      onOk: async () => {
        const result = await deleteMethod({
          $grid: tableAction.getGrid,
          body: {
            removeRecords: rows,
          },
        });
        successMessage(t('smartTable.message.deleteSuccess'));
        emit('proxyDelete', { status: true });
        const afterDelete = proxyConfig?.afterDelete || query;
        afterDelete && afterDelete(result);
        return true;
      },
      title: t('smartTable.message.confirm'),
    });
  };

  /**
   * 根据checkbox选中删除
   */
  const deleteByCheckbox = (): Promise<boolean | undefined> => {
    const tableInstance = tableAction.getGrid();
    if (!tableInstance) {
      return false;
    }
    const rows = tableInstance.getCheckboxRecords(false);
    if (rows.length === 0) {
      warningMessage(t('smartTable.message.deleteChoose'));
      return false;
    }
    return doDelete(rows);
  };

  return {
    computedProxyConfig,
    deleteByCheckbox,
    query,
  };
};

export { useSmartTableAjax };
