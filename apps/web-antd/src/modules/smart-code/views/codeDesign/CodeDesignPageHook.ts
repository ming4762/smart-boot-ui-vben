import type { ExtendedFormApi } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { ref, unref } from 'vue';

import { queryDbTableApi } from './CodeDesignPage.api';
import { injectCodeDesignContext } from './useContext';

/**
 * 加载数据库数据
 */
export const useLoadDbData = (formApi: ExtendedFormApi) => {
  const { setContext } = injectCodeDesignContext();

  // 数据库数据加载状态
  const dbDataRef = ref<Recordable<any>>({});
  const isSyncRef = ref(false);

  const getConvertTableData = () => {
    const dbData = unref(dbDataRef);
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
    dbDataRef.value = await queryDbTableApi(connectionId, tableName);
    setContext({
      tableData: getConvertTableData(),
    });
    isSyncRef.value = true;
  };

  return {
    dbDataRef,
    isSyncRef,
    handleSyncTableData,
  };
};
//
// /**
//  * 保存操作hook
//  */
// export const useSaveConfig = (
//   isSync: Ref<boolean>,
//   validate: Function,
//   dbDataRef: Ref<Recordable>,
//   afterSave?: Function,
// ) => {
//   const pageTableSettingRef = ref();
//   const pageSearchSettingRef = ref();
//   const pageFormSettingRef = ref();
//
//   const saveLoading = ref(false);
//
//   const handleSave = () => {
//     if (!unref(isSync)) {
//       message.warn(t('generator.views.code.validate.syncTable'));
//       return false;
//     }
//     if (!unref(pageTableSettingRef)) {
//       message.warn(t('generator.views.code.validate.tableSetting'));
//       return false;
//     }
//     if (!unref(pageFormSettingRef)) {
//       message.warn(t('generator.views.code.validate.formSetting'));
//       return false;
//     }
//     // 搜索配置实体
//     if (!unref(pageSearchSettingRef)) {
//       message.warn(t('generator.views.code.validate.searchSetting'));
//       return false;
//     }
//     // 验证必填字段是否设置表单
//     const pageFormSettingData = unref(
//       pageFormSettingRef,
//     ).getData() as Array<Recordable>;
//     const nonNullField: Array<string> = [];
//     pageFormSettingData.forEach((item) => {
//       if (
//         item.nullable === 0 &&
//         (item.visible === false || item.used === false)
//       ) {
//         nonNullField.push(item.columnName);
//       }
//     });
//     if (nonNullField.length > 0) {
//       Modal.confirm({
//         title: t('common.notice.confirmSave'),
//         // icon: createVNode(ExclamationCircleOutlined),
//         content: t(
//           'generator.views.code.message.saveConfirmContent',
//           nonNullField.join(','),
//         ),
//         onCancel() {
//           return false;
//         },
//         onOk() {
//           doSave();
//         },
//       });
//     } else {
//       doSave();
//     }
//   };
//
//   const doSave = async () => {
//     const formModel = await validate();
//     const dbData = unref(dbDataRef);
//     const saveData = {
//       ...formModel,
//       codePageConfigList: unref(pageTableSettingRef).getData(),
//       codeFormConfigList: unref(pageFormSettingRef).getData(),
//       codeSearchConfigList: unref(pageSearchSettingRef).getData(),
//       className: dbData.className,
//       remarks: dbData.remarks,
//     };
//     try {
//       saveLoading.value = true;
//       const configId = await saveConfigApi(saveData);
//       successMessage('保存成功');
//       afterSave && afterSave(configId);
//     } catch (error: any) {
//       if (error.code === 400) {
//         error.data.forEach((item: string) => {
//           message.error(item);
//         });
//       }
//       return false;
//     } finally {
//       saveLoading.value = false;
//     }
//   };
//
//   return {
//     handleSave,
//     pageTableSettingRef,
//     pageSearchSettingRef,
//     pageFormSettingRef,
//     saveLoading,
//   };
// };
