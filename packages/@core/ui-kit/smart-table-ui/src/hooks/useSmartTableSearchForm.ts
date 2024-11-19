import type { VbenFormProps } from '@vben-core/form-ui';
import type { Recordable } from '@vben-core/typings';

import type { SmartTableRenderProps } from '../types';
import type {
  SmartSearchFormParameter,
  SmartSearchFormProps,
  SmartSearchFormSchema,
} from '../types/SmartSearchFormType';

import { computed, h, ref, unref, watch } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { createIconifyIcon } from '@vben-core/icons';
import {
  isBoolean,
  isFunction,
  mergeWithArrayOverride,
} from '@vben-core/shared/utils';

import { useSmartTableContext } from '../types/useSmartTableContext';
import { getFormSize } from '../utils';

const AntSearchOutlined = createIconifyIcon('ant-design:search-outlined');

const AntRedoOutlined = createIconifyIcon('ant-design:redo-outlined');

/**
 * 搜索表单配置
 * @param tableProps
 * @param emit
 * @param t
 */
const useSmartTableSearchForm = (
  tableProps: SmartTableRenderProps,
  emit: (name: string, ...args: any[]) => void,
  t: (args: string) => string,
) => {
  /**
   * 搜索form显示状态
   */
  const searchFormVisibleRef = ref(
    unref(tableProps)?.searchFormConfig?.defaultVisible !== false,
  );

  watch(
    () => unref(tableProps)?.searchFormConfig?.visible,
    (value) => {
      searchFormVisibleRef.value = !!value;
    },
  );
  /**
   * 设置搜索表单的显示隐藏状态
   * @param visible
   */
  const setSearchFormVisible = (visible?: boolean) => {
    searchFormVisibleRef.value = isBoolean(visible)
      ? visible
      : !unref(searchFormVisibleRef);
  };
  /**
   * 创建表单
   */
  const [SearchForm, searchFormApi] = useVbenForm({
    handleReset: () => {
      const { query } = useSmartTableContext();
      searchFormApi.resetForm();
      query();
      emit('formQuery');
    },
    handleSubmit: () => {
      const { query } = useSmartTableContext();
      query();
      emit('formQuery');
    },
  });
  const computedSearchFormProps = computed(() => {
    const { searchFormConfig, size: tableSize } = unref(tableProps);
    const { resetButtonOptions, size, submitButtonOptions } =
      searchFormConfig || {};

    const defaultComponentProps = {
      allowClear: true,
    };

    const formSize = size || getFormSize(tableSize);
    const props: VbenFormProps = {
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
        icon: h(AntRedoOutlined, { class: ['anticon'] }),
        size: formSize,
        ...resetButtonOptions,
      },
      submitButtonOptions: {
        content: t('smartTable.button.search'),
        // loading: unref(getLoading),
        icon: h(AntSearchOutlined, { class: ['anticon'] }),
        size: formSize,
        ...submitButtonOptions,
      },
    };
    return props;
  });

  /**
   * 监控form配置变化, 更新form
   */
  watch(
    computedSearchFormProps,
    (value) => {
      searchFormApi.setState((prev) => {
        return {
          ...mergeWithArrayOverride({}, value, prev),
        };
      });
    },
    { immediate: true },
  );

  /**
   * 获取搜索符号
   */
  const getSearchFormSymbolRef = computed<
    { [index: string]: SmartSearchFormSchema } | boolean
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
        }
      } else {
        noSymbolForm[key] = value;
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

  return {
    getSearchFormParameter,
    SearchForm,
    searchFormApi,
    setSearchFormVisible,
  };
};

export { useSmartTableSearchForm };
