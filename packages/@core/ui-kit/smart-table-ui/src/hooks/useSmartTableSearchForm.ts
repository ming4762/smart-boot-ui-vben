import type { ComputedRef, Ref, Slots } from 'vue';

import type { VbenFormProps } from '@vben-core/form-ui';
import type { Recordable } from '@vben-core/typings';

import type {
  SmartSearchFormParameter,
  SmartSearchFormProps,
  SmartSearchFormSchema,
} from '../types/SmartSearchFormType';
import type { SmartTableRenderProps } from '../types/SmartTableCommonType';
import type { SmartTableContextHandler } from '../types/SmartTableInnerType';

import { computed, h, ref, unref, watch } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { createIconifyIcon } from '@vben-core/icons';
import { isBoolean, isFunction } from '@vben-core/shared/utils';

import { getFormSize } from '../utils';
import { getFormSlots } from '../utils/slots';

const AntSearchOutlined = createIconifyIcon('ant-design:search-outlined');

const AntRedoOutlined = createIconifyIcon('ant-design:redo-outlined');

/**
 * 搜索表单配置
 * @param tableProps
 * @param getSmartTableContext
 * @param emit
 * @param t
 * @param slots
 */
const useSmartTableSearchForm = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  getSmartTableContext: SmartTableContextHandler,
  emit: (name: string, ...args: any[]) => void,
  t: (args: string) => string,
  slots: Ref<Slots>,
) => {
  /**
   * 是否启用搜索表单
   */
  const getEnableSearchForm = computed(() => {
    const { useSearchForm } = unref(tableProps);
    return useSearchForm !== false;
  });

  /**
   * 搜索form显示状态
   */
  const searchFormVisibleRef = ref(
    unref(tableProps)?.searchFormConfig?.defaultVisible !== false &&
      unref(getEnableSearchForm),
  );

  watch(
    [() => unref(tableProps)?.searchFormConfig?.visible, getEnableSearchForm],
    ([visible, enableSearchForm]) => {
      searchFormVisibleRef.value = (visible && enableSearchForm) || false;
    },
  );
  /**
   * 设置搜索表单的显示隐藏状态
   * @param visible
   */
  const switchSearchFormVisible = (visible?: boolean) => {
    searchFormVisibleRef.value = isBoolean(visible)
      ? visible
      : !unref(searchFormVisibleRef);
  };
  /**
   * 创建表单
   */
  const [SearchForm, searchFormApi] = useVbenForm({
    handleReset: () => {
      const { query } = getSmartTableContext();
      searchFormApi.resetForm();
      query();
      emit('formQuery');
    },
    handleSubmit: () => {
      const { query } = getSmartTableContext();
      query();
      emit('formQuery');
    },
  });

  const AntRedoOutlinedComponent = h(AntRedoOutlined, { class: ['anticon'] });
  const AntSearchOutlinedComponent = h(AntSearchOutlined, {
    class: ['anticon'],
  });
  const computedSearchFormProps = computed(() => {
    const { searchFormConfig, size: tableSize } = unref(tableProps);
    const { resetButtonOptions, size, submitButtonOptions } =
      searchFormConfig || {};

    const defaultComponentProps = {
      allowClear: true,
    };

    const formSize = size || getFormSize(tableSize);

    // TODO：按钮加载状态变更会导致form重新渲染
    const {
      tableInnerContext: { tableLoading },
    } = getSmartTableContext();
    const props: VbenFormProps = {
      submitOnEnter: true,
      ...searchFormConfig,
      commonConfig: {
        ...searchFormConfig?.commonConfig,
        componentProps: (value, actions) => {
          const commonComponentProps =
            searchFormConfig?.commonConfig?.componentProps;
          if (!commonComponentProps) {
            return {
              ...defaultComponentProps,
              size: formSize,
            };
          }
          if (isFunction(commonComponentProps)) {
            const componentProps = commonComponentProps(value, actions);
            return {
              ...defaultComponentProps,
              ...componentProps,
              size: formSize,
            };
          }
          return {
            ...defaultComponentProps,
            ...commonComponentProps,
            size: formSize,
          };
        },
      },
      resetButtonOptions: {
        icon: AntRedoOutlinedComponent,
        size: formSize,
        ...resetButtonOptions,
      },
      submitButtonOptions: {
        content: t('smartTable.button.search'),
        icon: AntSearchOutlinedComponent,
        loading: unref(tableLoading),
        size: formSize,
        ...submitButtonOptions,
      },
    };
    return props;
  });

  const computedSearchFormSlots = computed(() => {
    const { searchFormConfig } = unref(tableProps);
    return getFormSlots(unref(slots), searchFormConfig);
  });

  /**
   * 获取搜索符号
   */
  const getSearchFormSymbolRef = computed<
    boolean | { [index: string]: SmartSearchFormSchema }
  >(() => {
    const { searchFormConfig, useSearchForm } = unref(tableProps);
    const searchWithSymbol = searchFormConfig?.searchWithSymbol;
    if (!useSearchForm || !searchWithSymbol) {
      return false;
    }
    const { schema } = searchFormConfig as Partial<SmartSearchFormProps>;
    const result: { [index: string]: SmartSearchFormSchema } = {};
    schema?.forEach((item) => {
      result[item.fieldName] = item;
    });
    return result;
  });

  const dealSearchSymbol = (info: Record<string, any>) => {
    const symbolForm: Recordable<any> = {};
    const noSymbolForm: Recordable<any> = {};
    const getSearchFormSymbol = unref(getSearchFormSymbolRef);
    if (isBoolean(getSearchFormSymbol)) {
      return info;
    }
    Object.keys(info).forEach((key) => {
      const value = info[key];
      const schema = getSearchFormSymbol[key];
      if (schema) {
        const { customSymbol, searchSymbol: symbol } = schema;
        if (customSymbol) {
          // 自定义符号
          const customSymbolResult = customSymbol({
            model: info,
            schema,
            value,
          });
          if (customSymbolResult) {
            Object.assign(symbolForm, customSymbolResult);
          }
        } else if (schema.searchSymbol) {
          if (symbol === 'between') {
            // between特殊处理
            if (value && Array.isArray(value) && value.length === 2) {
              symbolForm[`${key}@>=`] = value[0];
              symbolForm[`${key}@<=`] = value[1];
            }
          } else {
            symbolForm[`${key}@${symbol}`] = value;
          }
        } else {
          noSymbolForm[key] = value;
        }
      }
    });
    return {
      noSymbolForm,
      symbolForm,
    };
  };

  const getSearchFormParameter = async (): Promise<
    SmartSearchFormParameter | undefined
  > => {
    if (!unref(tableProps).useSearchForm) {
      return undefined;
    }
    const searchFormConfig = unref(tableProps).searchFormConfig;
    const searchFormValue = await searchFormApi.getValues();
    const searchWithSymbol = searchFormConfig?.searchWithSymbol;
    const result: SmartSearchFormParameter = {
      searchWithSymbol: isBoolean(searchWithSymbol) && searchWithSymbol,
    };
    if (result.searchWithSymbol) {
      // 处理搜索符号
      const { noSymbolForm, symbolForm } = dealSearchSymbol(searchFormValue);
      result.searchSymbolForm = symbolForm;
      result.noSymbolForm = noSymbolForm;
    }
    result.searchForm = searchFormValue;
    return result;
  };

  const computedSearchFormVisible = computed(() => unref(searchFormVisibleRef));

  /**
   * 是否有分隔符
   */
  const computedHasSeparator = computed(() => {
    if (!unref(getEnableSearchForm) || !unref(computedSearchFormVisible)) {
      return false;
    }
    const separator = unref(tableProps)?.searchFormConfig?.separator;
    if (separator === false) {
      return false;
    }
    if (separator === true || separator === undefined) {
      return true;
    }
    return separator.show !== false;
  });

  const computedSeparatorBackground = computed(() => {
    const separator = unref(tableProps)?.searchFormConfig?.separator;
    if (separator === undefined || isBoolean(separator)) {
      return undefined;
    }
    return separator.backgroundColor;
  });

  /**
   * 分割的位置
   */
  const computedSeparatorTop = computed(() => {
    const hasSeparator = unref(computedHasSeparator);
    if (!hasSeparator) {
      return true;
    }
    const layouts = unref(tableProps).layouts as string[] | undefined;
    if (!layouts || layouts.length === 0) {
      return true;
    }
    const tableIndex = layouts.indexOf('Table');
    const formIndex = layouts.indexOf('Form');
    return formIndex <= tableIndex;
  });

  return {
    computedHasSeparator,
    computedSearchFormVisible,
    computedSeparatorBackground,
    computedSeparatorTop,
    getEnableSearchForm,
    getSearchFormParameter,
    SearchForm: () =>
      h(
        SearchForm,
        { ...unref(computedSearchFormProps) },
        unref(computedSearchFormSlots),
      ),
    searchFormApi,
    switchSearchFormVisible,
  };
};

export { useSmartTableSearchForm };
