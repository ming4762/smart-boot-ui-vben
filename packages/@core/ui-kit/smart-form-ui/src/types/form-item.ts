import {
  SmartFormActionType,
  SmartFormRenderProps,
  SmartFormSchema,
} from './form';

interface SmartFormItemProps {
  allDefaultValues?: Record<string, any>;
  formActionType?: SmartFormActionType;
  formModel?: Record<string, any>;
  formProps?: SmartFormRenderProps;
  isAdvanced?: boolean;
  schema?: SmartFormSchema;
  setFormModel: (key: string, value: any, schema: SmartFormSchema) => void;
}

type ColSpanType = number | string;
interface ColEx {
  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;
  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { offset: ColSpanType; span: ColSpanType } | ColSpanType;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { offset: ColSpanType; span: ColSpanType } | ColSpanType;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { offset: ColSpanType; span: ColSpanType } | ColSpanType;

  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  style?: any;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { offset: ColSpanType; span: ColSpanType } | ColSpanType;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { offset: ColSpanType; span: ColSpanType } | ColSpanType;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { offset: ColSpanType; span: ColSpanType } | ColSpanType;
}

export { ColEx, SmartFormItemProps };
