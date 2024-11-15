import type { VxeGridPropTypes, VxeTableDefines } from 'vxe-table';

/**
 * 搜索参数类型
 */
interface SmartTableAjaxQueryParams<D>
  extends VxeGridPropTypes.ProxyAjaxQueryParams<D> {
  ajaxParameter?: Record<string, any>;
  searchForm?: Record<string, any>;
  searchFormSymbol?: Record<string, any>;
  searchInfo?: Record<string, any>;
}

interface SmartTableFetchParams {
  filters?: Partial<VxeTableDefines.FilterCheckedParams>[];
  page?: Partial<VxeGridPropTypes.ProxyAjaxQueryPageParams>;
  searchInfo?: Record<string, any>;
  sorts?: Partial<VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams>[];
}

interface SmartTableProxyAjax<D = any> {
  delete?(
    params: VxeGridPropTypes.ProxyAjaxDeleteParams<D>,
    ...args: any[]
  ): Promise<any>;
  deleteError?(
    params: VxeGridPropTypes.ProxyAjaxDeleteParams<D> &
      VxeGridPropTypes.ProxyAjaxResponseParams,
  ): void;
  deleteSuccess?(
    params: VxeGridPropTypes.ProxyAjaxDeleteParams<D> &
      VxeGridPropTypes.ProxyAjaxResponseParams,
  ): void;
  getById?(params: D): Promise<D>;
  query?(params: SmartTableAjaxQueryParams<D>, ...args: any[]): Promise<any>;
  queryAll?(params: VxeGridPropTypes.ProxyAjaxQueryAllParams<D>): Promise<any>;
  queryAllError?(
    params: VxeGridPropTypes.ProxyAjaxQueryAllParams<D> &
      VxeGridPropTypes.ProxyAjaxResponseParams,
  ): void;
  queryAllSuccess?(
    params: VxeGridPropTypes.ProxyAjaxQueryAllParams<D> &
      VxeGridPropTypes.ProxyAjaxResponseParams,
  ): void;
  queryError?(
    params: VxeGridPropTypes.ProxyAjaxQueryParams<D> &
      VxeGridPropTypes.ProxyAjaxResponseParams,
  ): void;
  querySuccess?(
    params: VxeGridPropTypes.ProxyAjaxQueryParams<D> &
      VxeGridPropTypes.ProxyAjaxResponseParams,
  ): void;
  save?(
    params: VxeGridPropTypes.ProxyAjaxSaveParams<D>,
    ...args: any[]
  ): Promise<any>;
  saveError?(
    params: VxeGridPropTypes.ProxyAjaxResponseParams &
      VxeGridPropTypes.ProxyAjaxSaveParams<D>,
  ): void;
  saveSuccess?(
    params: VxeGridPropTypes.ProxyAjaxResponseParams &
      VxeGridPropTypes.ProxyAjaxSaveParams<D>,
  ): void;
}

interface SmartTableProxyConfig<T = any>
  extends Omit<VxeGridPropTypes.ProxyConfig, 'ajax'> {
  // 删除回调
  afterDelete?: (result?: any) => void;
  afterLoad?: (result: any) => any;
  afterUserYn?: (result: any) => void;
  ajax?: SmartTableProxyAjax<T>;
}

export type {
  SmartTableAjaxQueryParams,
  SmartTableFetchParams,
  SmartTableProxyAjax,
  SmartTableProxyConfig,
};
