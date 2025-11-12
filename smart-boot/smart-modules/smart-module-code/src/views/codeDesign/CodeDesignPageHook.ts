import type { Ref } from 'vue';

import type { ExtendedFormApi } from '@vben/common-ui';

import type { CodeDesignContextData, CodeDesignHandler } from './useContext';

import { onMounted, ref, unref, watch } from 'vue';

import { $t as t } from '@vben/locales';

import { errorMessage, successMessage, warnMessage } from '@smart/common/utils';

import {
  getConfigByIdApi,
  queryDbTableApi,
  saveConfigApi,
} from './CodeDesignPage.api';
import { injectCodeDesignContext, injectCodeDesignHandler } from './useContext';

/**
 * 加载数据库数据
 */
export const useLoadDbData = (
  formApi: ExtendedFormApi,
  configIdRef: Ref<number | string | undefined>,
  systemIdRef: Ref<number | string | undefined>,
) => {
  const { setContext } = injectCodeDesignContext();
  const { registerHandler } = injectCodeDesignHandler();

  // 数据库数据加载状态
  const isSyncRef = ref(false);

  const getConvertTableData = (dbData: any) => {
    if (!dbData.tableName) {
      return [];
    }
    const primaryKeyList = dbData.primaryKeyList || [];
    const baseColumnList = dbData.baseColumnList || [];
    return [...primaryKeyList, ...baseColumnList];
  };

  const handleSyncTableData = async () => {
    const formInstance = formApi.form;
    const [connectionIdValidate, tableNameValidate] = await Promise.all([
      formInstance.validateField('connectionId'),
      formInstance.validateField('tableName'),
    ]);
    if (!connectionIdValidate.valid || !tableNameValidate.valid) {
      throw new Error('表单校验失败');
    }
    const { connectionId, tableName } = await formApi.getValues();
    const dbData = await queryDbTableApi(connectionId, tableName);
    setContext({
      tableData: getConvertTableData(dbData),
      dbData,
      isSyncDb: true,
    });
    isSyncRef.value = true;
  };

  // 注册函数
  registerHandler({
    handleSyncTableData,
  });

  /**
   * 加载配置数据
   */
  const configLoadingRef = ref(false);
  const loadConfigData = async () => {
    try {
      configLoadingRef.value = true;
      const configId = unref(configIdRef);
      if (!configId) {
        return;
      }
      const result = await getConfigByIdApi(configId);
      await formApi.setValues(result);
      // 加载表格数据
      await handleSyncTableData();
      const { codePageConfigList, codeFormConfigList, codeSearchConfigList } =
        result;
      setContext({
        editConfigData: {
          codePageConfigList,
          codeFormConfigList,
          codeSearchConfigList,
        },
      });
    } finally {
      configLoadingRef.value = false;
    }
  };
  // 注册函数
  registerHandler({
    loadConfigData,
  });
  onMounted(() => {
    /**
     * 监控configId变化，更新数据
     */
    watch(
      configIdRef,
      (value) => {
        if (value) {
          loadConfigData();
        } else {
          formApi.setFieldValue('systemId', unref(systemIdRef));
        }
      },
      {
        immediate: true,
      },
    );
  });

  return {
    isSyncRef,
    handleSyncTableData,
    configLoadingRef,
    loadConfigData,
  };
};

export const useSaveConfig = (
  configIdRef: Ref<number | string | undefined>,
  getHandlerContext: () => CodeDesignHandler,
  contextData: Ref<CodeDesignContextData>,
  afterSave?: (configId: number) => void,
) => {
  const saveLoading = ref(false);

  const validateData = (data: any) => {
    if (unref(configIdRef) !== undefined) {
      return;
    }
    const { codePageConfigList, codeFormConfigList, codeSearchConfigList } =
      data;
    const errorMessageList: string[] = [];
    if (codeFormConfigList === undefined) {
      errorMessageList.push(
        t('smart.code.views.codeManager.validate.formSetting'),
      );
    }
    if (codePageConfigList === undefined) {
      errorMessageList.push(
        t('smart.code.views.codeManager.validate.tableSetting'),
      );
    }
    if (codeSearchConfigList === undefined) {
      errorMessageList.push(
        t('smart.code.views.codeManager.validate.searchSetting'),
      );
    }
    if (errorMessageList.length > 0) {
      const errorMessageStr = errorMessageList.join('\n');
      errorMessage(errorMessageStr);
      throw new Error(`error:${errorMessageStr}`);
    }
  };

  const handleSave = async () => {
    if (!unref(contextData).isSyncDb) {
      warnMessage(t('smart.code.views.codeManager.validate.syncTable'));
      return false;
    }
    const handlerContext = getHandlerContext();
    const data: any = {};
    const resultList = await Promise.all(
      handlerContext.saveDataHandler.map(async (handler) => {
        return handler();
      }),
    );
    resultList.forEach((item) => {
      Object.assign(data, item);
    });
    // 校验数据
    validateData(data);
    try {
      saveLoading.value = true;
      const configId = await saveConfigApi(data);
      successMessage(t('common.message.saveSuccess'));
      afterSave && afterSave(configId);
    } finally {
      saveLoading.value = false;
    }
  };

  return {
    saveLoading,
    handleSave,
  };
};
