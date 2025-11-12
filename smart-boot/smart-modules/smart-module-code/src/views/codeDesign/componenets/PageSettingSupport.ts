import type { Ref } from 'vue';

import { ref, watch } from 'vue';

import { $t as t } from '@vben/locales';

import { RULE_LIST } from '../constants';

let ruleList: { label: string; value: string }[] = [];

export const getRuleList = () => {
  if (ruleList.length > 0) {
    return ruleList;
  }
  ruleList = RULE_LIST.map((item) => {
    return {
      label: t(item.label),
      value: item.value,
    };
  });
  return ruleList;
};

/**
 * table header checkbox
 * @param tableData
 * @param field
 * @param defaultValue
 */
export const vueTableHeaderCheckboxSupport = (
  tableData: Ref,
  field: string,
  defaultValue = true,
) => {
  const checked = ref(defaultValue);
  watch(checked, () => {
    tableData.value.forEach((item: any) => {
      item[field] = checked.value;
    });
  });
  return {
    checked,
  };
};

/**
 * 下拉表格支持
 */
// export const vueChoseSelectTableSupport = (currentRow: Ref) => {
//   const [registerSelectTableModal, { openModal: openSelectTableModal }] =
//     useModal();
//   /**
//    * 显示列选择
//    * @param row
//    */
//   const handleShowChoseSelectTable = (row: any) => {
//     currentRow.value = row;
//     openSelectTableModal(true, {});
//   };
//   /**
//    * 选择表格后
//    * @param tableList
//    */
//   const handleChoseTable = (tableList: Array<any>) => {
//     currentRow.value.selectTableList = tableList;
//   };
//   return {
//     registerSelectTableModal,
//     handleShowChoseSelectTable,
//     handleChoseTable,
//   };
// };
