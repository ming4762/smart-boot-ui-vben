import type { VbenFormSchema } from '@vben-core/form-ui';

import type { SmartTableBasicFormConfig } from './SmartTableCommonType';

/**
 * 支持的搜索符号
 */
type SearchSymbol =
  | '<'
  | '<='
  | '<>'
  | '='
  | '>'
  | '>='
  | 'between'
  | 'groupBy'
  | 'in'
  | 'like'
  | 'likeLeft'
  | 'likeRight'
  | 'notIn'
  | 'notLike';

/**
 * 搜索表单项配置
 */
interface SmartSearchFormSchema extends VbenFormSchema {
  customSymbol?: ({
    model,
    schema,
    value,
  }: {
    model: Record<string, any>;
    schema: SmartSearchFormSchema;
    value: any;
  }) => Record<string, any>;
  // 向后台发送的符号
  searchSymbol?: SearchSymbol;
}

interface SmartSearchFormParameter {
  noSymbolForm?: Record<string, any>;
  searchForm?: Record<string, any>;
  searchSymbolForm?: Record<string, any>;
  searchWithSymbol?: boolean;
}

interface SmartSearchFormSeparator {
  backgroundColor?: string;
  show?: boolean;
}

/**
 * 搜索表单配置
 */
interface SmartSearchFormProps extends SmartTableBasicFormConfig {
  // 是否默认隐藏搜索
  defaultVisible?: boolean;
  // 搜索表单项配置
  schema?: SmartSearchFormSchema[];
  // 向后台发送的参数是否带有符号
  searchWithSymbol?: boolean;
  // 搜索表单和表格之间是否有分隔条
  separator?: boolean | SmartSearchFormSeparator;
  size?: string;
  visible?: boolean;
}

export type {
  SmartSearchFormParameter,
  SmartSearchFormProps,
  SmartSearchFormSchema,
};
