import type { VbenFormSchema } from '#/adapter/form';

import { listCurrentUserConnection } from './CodeSqlMapperView.api';

export const getSqlMapperFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: 'SQL脚本',
      fieldName: 'sql',
      component: 'SmartCodeEditor',
      rules: 'required',
      formItemClass: 'col-span-5',
      componentProps: {
        language: 'sql',
        style: { height: '320px' },
      },
    },
    {
      label: '数据库连接',
      fieldName: 'dbConnectionId',
      component: 'ApiSelect',
      rules: 'required',
      componentProps: {
        class: 'w-full',
        api: listCurrentUserConnection,
        valueField: 'id',
        labelField: 'connectionName',
      },
    },
    {
      label: '包名',
      fieldName: 'packageName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: 'Mapper类名',
      fieldName: 'className',
      component: 'Input',
      rules: 'required',
    },
    {
      label: '函数名',
      fieldName: 'methodName',
      component: 'Input',
      rules: 'required',
    },
  ];
};
