import type { VbenFormProps, VbenFormSchema } from '@vben-core/form-ui';

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

/**
 * 搜索表单配置
 */
interface SmartSearchFormProps extends VbenFormProps {
  // 是否默认隐藏搜索
  defaultVisible?: boolean;
  // 搜索表单项配置
  schemas?: SmartSearchFormSchema[];
  // 向后台发送的参数是否带有符号
  searchWithSymbol?: boolean;
}

export type { SmartSearchFormProps };
