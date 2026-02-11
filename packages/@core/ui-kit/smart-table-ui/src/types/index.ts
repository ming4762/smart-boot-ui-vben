import type { VxeGridDefines, VxeUIExport } from 'vxe-table';

import type { Component, Ref, Slots } from 'vue';

import type { SupportedLanguagesType } from '@vben-core/preferences';
import type { SmartAuthType } from '@vben-core/typings';

import type { SmartTableApi } from '../smart-table-api';
import type { SmartTableAction } from './SmartTableActionType';
import type { SmartTableRenderProps } from './SmartTableCommonType';
import type { SmartTableMessageHandler } from './SmartTableMessageType';

/**
 * table layout props
 */
interface SmartTableLayoutProps {
  showSearch?: boolean;
}

/**
 * SmartTable事件
 */
type SmartTableRenderListeners = {
  addEditModalShow: [
    {
      formData: Record<string, any>;
      isAdd: boolean;
      selectData: Record<string, any>;
    },
  ];
  afterSaveUpdate: [boolean];
  cellClick: [VxeGridDefines.CellClickEventParams];
  formQuery: [];
  // 表格初始化完成时间
  initialized: [];
  'proxy-query': [any];
  proxyDelete: [{ status: boolean }];
  register: [SmartTableAction];
  'toolbar-tool-click': [any];
};

/**
 * SmartTable props
 */
interface SmartTableProps extends SmartTableRenderProps {
  abc?: string;
}

/**
 * Smart Table API
 */
type ExtendSmartTableApi = SmartTableAction &
  SmartTableApi & {
    useStore: <T = NoInfer<SmartTableProps>>(
      selector?: (state: NoInfer<SmartTableProps>) => T,
    ) => Readonly<Ref<T>>;
  };

/**
 * 初始化表格接口
 */
interface SetupSmartTable {
  componentHandler?: (name: string) => Component | string | undefined;
  configSmartTable: (ui: VxeUIExport) => void;
  // 默认插槽
  defaultSlots?: () => Slots;
  i18nHandler?: (key: string, args?: any) => string;
  messageHandler?: SmartTableMessageHandler;
  permissionHandler?: (code?: SmartAuthType) => boolean;
  watcherField: Ref<{ locale: SupportedLanguagesType; theme: string }>;
}

export type {
  ExtendSmartTableApi,
  SetupSmartTable,
  SmartTableAction,
  // SmartTableAjaxQueryParams,
  // SmartTableFetchParams,
  SmartTableLayoutProps,
  SmartTableProps,
  // SmartTableProxyAjax,
  SmartTableRenderListeners,
};

export type { SmartSearchFormSchema } from './SmartSearchFormType';

export type { SmartTableColumn } from './SmartTableColumnType';
export type {
  SmartCheckboxConfig,
  SmartTableSize,
  SmartTableToolbarConfig,
} from './SmartTableCommonType';

export type { SmartTableActionItem } from './SmartTableRowActionType';
