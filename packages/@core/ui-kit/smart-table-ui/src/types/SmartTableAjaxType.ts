import type { VxeGridPropTypes } from 'vxe-table';

/**
 * 搜索参数类型
 */
interface SmartTableAjaxQueryParams
  extends VxeGridPropTypes.ProxyAjaxQueryParams {
  ajaxParameter?: Record<string, any>;
  searchForm?: Record<string, any>;
  searchFormSymbol?: Record<string, any>;
  searchInfo?: Record<string, any>;
}

interface SmartTableProxyConfig<T = any> extends VxeGridPropTypes.ProxyConfig {
  // 删除回调
  afterDelete?: (result?: any) => void;
  afterLoad?: (result: any) => any;
  afterUserYn?: (result: any) => void;
  ajax?: {
    delete?(
      params: VxeGridPropTypes.ProxyAjaxDeleteParams,
      ...args: any[]
    ): Promise<any>;
    getById?(params: T): Promise<T>;
    query?(params: SmartTableAjaxQueryParams, ...args: any[]): Promise<any>;
    queryAll?(
      params: VxeGridPropTypes.ProxyAjaxQueryAllParams,
      ...args: any[]
    ): Promise<any>;
    save?(
      params: VxeGridPropTypes.ProxyAjaxSaveParams,
      ...args: any[]
    ): Promise<any>;
    useYn?(
      rows: T[],
      useYn: boolean,
      params?: Record<string, any>,
    ): Promise<any>;
  };
}

export type { SmartTableAjaxQueryParams, SmartTableProxyConfig };
