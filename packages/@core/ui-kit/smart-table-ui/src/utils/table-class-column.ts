import type { SmartTableColumn } from '../types';

import { getI18n as t } from 'vxe-table';

/**
 * 启用停用列使用class样式
 * @param field
 */
const getTableUseYnColumnClass = (field = 'useYn'): SmartTableColumn => {
  return {
    dynamicClass: ({ row }) => {
      const useYn = row[field] as boolean | null;
      if (useYn === null) {
        return '';
      }
      return useYn ? 'text-color--success-bold' : 'text-color--danger-bold';
    },
    field,
    formatter: ({ row }) => {
      const useYn = row[field] as boolean | null;
      if (useYn === null) {
        return '';
      }
      return useYn ? t('smartTable.common.use') : t('smartTable.common.noUse');
    },
    title: t('smartTable.title.useYn'),
    width: 100,
  };
};

const getTableBooleanColumnClass = (field: string): SmartTableColumn => {
  return {
    dynamicClass: ({ row }) => {
      const value = row[field] as boolean | null;
      if (value === null) {
        return '';
      }
      return value ? 'text-color--success-bold' : 'text-color--danger-bold';
    },
    field,
    formatter({ row }) {
      const value = row[field] as boolean | null;
      if (value === null) {
        return '';
      }
      return value ? t('smartTable.common.yes') : t('smartTable.common.no');
    },
    width: 100,
  };
};

export { getTableBooleanColumnClass, getTableUseYnColumnClass };
