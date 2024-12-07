import type {
  SmartTableAjaxQueryParams,
  SmartTableFetchParams,
  SmartTableProxyAjax,
  SmartTableRenderProps,
} from '../types';
import type { SmartTableContextHandler } from '../types/SmartTableInnerType';

import { computed, type ComputedRef, h, nextTick, unref } from 'vue';

import { merge } from '@vben-core/shared/utils';

import { type VxeGridPropTypes } from 'vxe-table';

import {
  confirmIcon,
  confirmModal,
  successMessage,
  warningMessage,
} from '../utils';

const useSmartTableAjax = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  getSmartTableContext: SmartTableContextHandler,
  emit: (name: string, ...args: any[]) => void,
  t: (args: string) => string,
) => {
  let initQuery = false;
  // 是否自动加载，这么做的目的
  const computedProxyConfig = computed(() => {
    const { proxyConfig, sortConfig, useSearchForm } = unref(tableProps);
    if (!proxyConfig) {
      return undefined;
    }
    const ajax: SmartTableProxyAjax = proxyConfig.ajax || {};
    let queryAjax: SmartTableProxyAjax = {};

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
          const getSearchFormParameter =
            getSmartTableContext().tableInnerAction.getSearchFormParameter;
          const {
            noSymbolForm,
            searchForm,
            searchSymbolForm,
            searchWithSymbol,
          } = (await getSearchFormParameter()) || {};
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
          const result = await ajax.query?.(searchParameter);
          // 标记已经初始化
          if (!initQuery) {
            initQuery = true;
          }
          return result;
        },
        querySuccess(params) {
          if (ajax.querySuccess) {
            ajax.querySuccess(params);
          }
          nextTick(() => {
            emit('proxy-query', params);
          });
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
    const { getGrid, setLoading } = getSmartTableContext();
    try {
      setLoading(true);
      const code = initQuery ? 'query' : '_init';
      await getGrid().commitProxy(code, params);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 执行删除操作
   * @param rows 需要删除的行
   */
  const doDelete = async (rows: any[]): Promise<boolean> => {
    const proxyConfig = unref(tableProps).proxyConfig;
    const deleteMethod = proxyConfig?.ajax?.delete;
    if (!deleteMethod) {
      throw new Error('proxyConfig.ajax.delete未配置，无法删除');
    }
    if (rows.length === 0) {
      return false;
    }
    const { getGrid } = getSmartTableContext();
    return new Promise((resolve) => {
      confirmModal({
        content: t('smartTable.message.deleteConfirm'),
        icon: h(confirmIcon, { class: ['anticon'] }),
        onCancel: () => {
          resolve(false);
        },
        onOk: async () => {
          const result = await deleteMethod({
            $grid: getGrid(),
            body: {
              removeRecords: rows,
            },
          });
          successMessage(t('smartTable.message.deleteSuccess'));
          emit('proxyDelete', { status: true });
          const afterDelete = proxyConfig?.afterDelete || query;
          afterDelete && afterDelete(result);
          resolve(true);
        },
        title: t('smartTable.message.confirm'),
      });
    });
  };

  /**
   * 根据checkbox选中删除
   */
  const deleteByCheckbox = async (): Promise<boolean> => {
    const { getGrid } = getSmartTableContext();
    const tableInstance = getGrid();
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

  /**
   * 根据行删除
   * @param row
   */
  const deleteByRow = (row: any | any[]): Promise<boolean> => {
    if (Array.isArray(row)) {
      return doDelete(row);
    }
    return doDelete([row]);
  };

  const doSetUseYn = async (
    rows: any[],
    useYn: boolean,
    params?: Record<string, any>,
  ): Promise<boolean> => {
    const proxyConfig = unref(tableProps).proxyConfig;
    const useYnMethod = proxyConfig?.ajax?.useYn;
    if (!useYnMethod) {
      throw new Error('proxyConfig.ajax.useYn未配置，无法执行启用停用操作');
    }
    if (rows.length === 0) {
      return false;
    }
    return new Promise<boolean>((resolve) => {
      confirmModal({
        content: useYn
          ? t('smartTable.message.useYnTrueConfirm')
          : t('smartTable.message.useYnFalseConfirm'),
        iconType: 'warning',
        onCancel: () => {
          resolve(false);
        },
        onOk: async () => {
          const result = await useYnMethod(rows, useYn, params);
          successMessage(t('smartTable.message.OperationSucceeded'));
          const afterHandler = proxyConfig?.afterUserYn || query;
          afterHandler && afterHandler(result);
          resolve(true);
        },
      });
    });
  };

  const setUseYnByCheckbox = async (
    useYn: boolean,
    params?: Record<string, any>,
  ): Promise<boolean> => {
    const { getGrid } = getSmartTableContext();
    const selectRows = getGrid().getCheckboxRecords(false);
    if (selectRows.length === 0) {
      warningMessage(t('smartTable.message.needSelect'));
      return false;
    }
    return doSetUseYn(selectRows, useYn, params);
  };

  const setUseYnByRow = (
    row: any | any[],
    useYn: boolean,
    params?: Record<string, any>,
  ) => {
    if (Array.isArray(row)) {
      return doSetUseYn(row, useYn);
    }
    return doSetUseYn([row], useYn, params);
  };

  return {
    computedProxyConfig,
    deleteByCheckbox,
    deleteByRow,
    query,
    setUseYnByCheckbox,
    setUseYnByRow,
  };
};

export { useSmartTableAjax };
