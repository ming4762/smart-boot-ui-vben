import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { getTableUseYnColumnClass, z } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { isJsonString } from '@vben/utils';

export enum Permissions {
  delete = 'sso:oauth2:client:delete',
  save = 'sso:oauth2:client:save',
  setUseYn = 'sso:oauth2:client:setUseYn',
  update = 'sso:oauth2:client:update',
}

/**
 * 表格列表
 */
export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'clientId',
      align: 'left',
      title: '{sso.oauth2.client.title.clientId}',
      width: 120,
    },
    {
      field: 'clientName',
      align: 'left',
      title: '{sso.oauth2.client.title.clientName}',
      width: 120,
    },
    {
      field: 'clientSecret',
      align: 'left',
      title: '{sso.oauth2.client.title.clientSecret}',
      width: 120,
    },
    {
      field: 'clientSecretExpire',
      align: 'center',
      title: '{sso.oauth2.client.title.clientSecretExpire}',
      width: 120,
    },
    {
      field: 'clientAuthenticationMethods',
      align: 'left',
      title: '{sso.oauth2.client.title.clientAuthenticationMethods}',
      width: 120,
    },
    {
      field: 'authorizationGrantTypes',
      align: 'left',
      title: '{sso.oauth2.client.title.authorizationGrantTypes}',
      width: 120,
    },
    {
      field: 'redirectUri',
      align: 'left',
      title: '{sso.oauth2.client.title.redirectUri}',
      width: 120,
    },
    {
      field: 'postLogoutRedirectUri',
      align: 'left',
      title: '{sso.oauth2.client.title.postLogoutRedirectUri}',
      width: 120,
    },
    {
      field: 'scopes',
      align: 'left',
      title: '{sso.oauth2.client.title.scopes}',
      width: 120,
    },
    {
      field: 'clientSettings',
      align: 'left',
      title: '{sso.oauth2.client.title.clientSettings}',
      width: 120,
    },
    {
      field: 'tokenSettings',
      align: 'left',
      title: '{sso.oauth2.client.title.tokenSettings}',
      width: 120,
    },
    {
      field: 'remark',
      align: 'left',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'useYn',
      align: 'left',
      ...getTableUseYnColumnClass(),
      width: 120,
    },
    {
      field: 'createBy',
      align: 'left',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'createTime',
      align: 'center',
      title: '{common.table.createTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      align: 'left',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      align: 'center',
      title: '{common.table.updateTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'clientId',
      label: t('sso.oauth2.client.title.clientId'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'clientName',
      label: t('sso.oauth2.client.title.clientName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'clientSecret',
      label: t('sso.oauth2.client.title.clientSecret'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'clientSecretExpire',
      label: t('sso.oauth2.client.title.clientSecretExpire'),
      component: 'DatePicker',
      controlClass: 'w-full',
      componentProps: {
        showTime: true,
      },
    },
    {
      fieldName: 'clientAuthenticationMethods',
      label: t('sso.oauth2.client.title.clientAuthenticationMethods'),
      component: 'Textarea',
      componentProps: {
        placeholder:
          '支持多个，每个一行，可选值：client_secret_basic, client_secret_post, client_secret_jwt',
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'authorizationGrantTypes',
      label: t('sso.oauth2.client.title.authorizationGrantTypes'),
      component: 'Textarea',
      componentProps: {
        placeholder:
          '支持多个，每个一行，可选值：authorization_code, refresh_token, client_credentials',
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'redirectUri',
      label: t('sso.oauth2.client.title.redirectUri'),
      component: 'Textarea',
      componentProps: {
        placeholder: '支持多个，每个一行',
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'postLogoutRedirectUri',
      label: t('sso.oauth2.client.title.postLogoutRedirectUri'),
      component: 'Textarea',
      componentProps: {
        placeholder: '支持多个，每个一行',
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'scopes',
      label: t('sso.oauth2.client.title.scopes'),
      component: 'Textarea',
      componentProps: {
        placeholder: '支持多个，每个一行',
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'clientSettings',
      label: t('sso.oauth2.client.title.clientSettings'),
      component: 'Textarea',
      componentProps: {},
      formItemClass: 'col-span-2',
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: 'meta必须为json字符串',
          },
        ),
    },
    {
      fieldName: 'tokenSettings',
      label: t('sso.oauth2.client.title.tokenSettings'),
      component: 'Textarea',
      componentProps: {},
      formItemClass: 'col-span-2',
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: 'meta必须为json字符串',
          },
        ),
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
      formItemClass: 'col-span-2',
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'clientId',
      label: t('sso.oauth2.client.title.clientId'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'clientName',
      label: t('sso.oauth2.client.title.clientName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};
