import { $t as t } from '@vben/locales';

export type CONTROL_TYPE =
  | 'CATEGORY_DICT'
  | 'CHECKBOX'
  | 'DATA_DICT'
  | 'DATE'
  | 'DATETIME'
  | 'FILE'
  | 'INPUT'
  | 'NUMBER'
  | 'PASSWORD'
  | 'RADIO'
  | 'SELECT'
  | 'SELECT_TABLE'
  | 'SWITCH_TYPE'
  | 'TEXTAREA'
  | 'TEXTAREA_JSON'
  | 'TIME'
  | 'TRANSFER';

/**
 * 控件列表
 */
const CONTROL_LIST: { key: CONTROL_TYPE; value: string }[] = [
  {
    key: 'INPUT',
    value: 'smart.code.views.codeManager.title.controlList.input',
  },
  {
    key: 'TEXTAREA',
    value: 'smart.code.views.codeManager.title.controlList.textarea',
  },
  {
    key: 'TEXTAREA_JSON',
    value: 'smart.code.views.codeManager.title.controlList.textareaJson',
  },
  {
    key: 'NUMBER',
    value: 'smart.code.views.codeManager.title.controlList.number',
  },
  {
    key: 'PASSWORD',
    value: 'smart.code.views.codeManager.title.controlList.password',
  },
  {
    key: 'SELECT',
    value: 'smart.code.views.codeManager.title.controlList.select',
  },
  {
    key: 'TRANSFER',
    value: 'smart.code.views.codeManager.title.controlList.transfer',
  },
  {
    key: 'SELECT_TABLE',
    value: 'smart.code.views.codeManager.title.controlList.selectTable',
  },
  {
    key: 'RADIO',
    value: 'smart.code.views.codeManager.title.controlList.radio',
  },
  {
    key: 'CHECKBOX',
    value: 'smart.code.views.codeManager.title.controlList.checkbox',
  },
  {
    key: 'SWITCH_TYPE',
    value: 'smart.code.views.codeManager.title.controlList.switch_type',
  },
  {
    key: 'DATE',
    value: 'smart.code.views.codeManager.title.controlList.date',
  },
  {
    key: 'TIME',
    value: 'smart.code.views.codeManager.title.controlList.time',
  },
  {
    key: 'DATETIME',
    value: 'smart.code.views.codeManager.title.controlList.datetime',
  },
  {
    key: 'FILE',
    value: 'smart.code.views.codeManager.title.controlList.file',
  },
  {
    key: 'DATA_DICT',
    value: 'smart.code.views.design.title.controlList.dataDict',
  },
  {
    key: 'CATEGORY_DICT',
    value: 'smart.code.views.design.title.controlList.categoryDict',
  },
];
let controlList: { label: string; value: string }[] = [];
export const getControlList = () => {
  if (controlList.length > 0) {
    return controlList;
  }
  controlList = CONTROL_LIST.map((item) => {
    return {
      label: t(item.value),
      value: item.key,
    };
  });
  return controlList;
};

/**
 * 查询标识列表
 */
export const SEARCH_SYMBOL_LIST = [
  '=',
  'like',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'notIn',
  'notLike',
  'likeLeft',
  'likeRight',
];

export const RULE_LIST = [
  {
    value: 'NOT_EMPTY',
    label: 'smart.code.views.codeManager.title.ruleList.notEmpty',
  },
  {
    value: 'PHONE',
    label: 'smart.code.views.codeManager.title.ruleList.PHONE',
  },
  {
    value: 'EMAIL',
    label: 'smart.code.views.codeManager.title.ruleList.EMAIL',
  },
  {
    value: 'NUMBER',
    label: 'smart.code.views.codeManager.title.ruleList.NUMBER',
  },
  {
    value: 'REGEXP',
    label: 'smart.code.views.codeManager.title.ruleList.REGEXP',
  },
];

/**
 * 数据库类型和控件映射关系
 */
export const DB_TYPE_CONTROL_MAPPING: Record<string, CONTROL_TYPE> = {
  TINYINT: 'SWITCH_TYPE',
  INTEGER: 'NUMBER',
  BIGINT: 'NUMBER',
  FLOAT: 'NUMBER',
  DOUBLE: 'NUMBER',
  NUMERIC: 'NUMBER',
  DECIMAL: 'NUMBER',
  CHAR: 'INPUT',
  VARCHAR: 'INPUT',
  LONGVARCHAR: 'TEXTAREA',
  DATE: 'DATE',
  TIME: 'DATETIME',
  TIMESTAMP: 'DATETIME',
  BLOB: 'TEXTAREA',
  CLOB: 'TEXTAREA',
  NCHAR: 'INPUT',
  NVARCHAR: 'INPUT',
  LONGNVARCHAR: 'TEXTAREA',
  NCLOB: 'TEXTAREA',
  JSON: 'TEXTAREA_JSON',
};
