import type { VbenFormProps } from '@vben-core/form-ui';

import type { SmartTableRenderProps } from '../types';

import { computed, ref, unref, watch } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { mergeWithArrayOverride } from '@vben-core/shared/utils';

import { getFormSize } from '../utils';

/**
 * 搜索表单配置
 * @param tableProps
 */
const useSmartTableSearchForm = (tableProps: SmartTableRenderProps) => {
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

  const [SearchForm, searchFormApi] = useVbenForm();
  const computedSearchFormProps = computed(() => {
    const { searchFormConfig, size } = unref(tableProps);
    const { resetButtonOptions, submitButtonOptions } = searchFormConfig || {};

    const props: VbenFormProps = {
      ...searchFormConfig,
      resetButtonOptions: {
        preIcon: 'ic:baseline-restart-alt',
        ...resetButtonOptions,
      },
      submitButtonOptions: {
        // loading: unref(getLoading),
        preIcon: 'ant-design:search-outlined',
        ...submitButtonOptions,
      },
    };
    if (size) {
      props.size = searchFormConfig?.size || getFormSize(size);
    }
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

  return {
    SearchForm,
    setSearchFormVisible,
  };
};

export { useSmartTableSearchForm };
