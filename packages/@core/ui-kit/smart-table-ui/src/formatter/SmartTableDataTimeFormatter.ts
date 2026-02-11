import { formatDate } from '@vben-core/shared/utils';

import { VxeUI } from 'vxe-table';

export default function initSmartTableDataTimeFormatter() {
  VxeUI.formats.add('datetime', {
    tableCellFormatMethod: ({ cellValue }, format) => {
      if (!cellValue) {
        return '';
      }
      return formatDate(cellValue, format) || cellValue;
    },
  });

  VxeUI.formats.add('date', {
    tableCellFormatMethod: ({ cellValue }, format) => {
      if (!cellValue) {
        return '';
      }
      return formatDate(cellValue, format) || cellValue;
    },
  });
}
