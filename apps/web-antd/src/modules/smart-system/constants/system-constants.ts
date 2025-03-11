import { $t as t } from '@vben/locales';

export const DATA_PERMISSION_SCOPE = [
  {
    label: t('system.views.dataPermission.title.permissionScope.ALL'),
    value: 'DATA_ALL',
  },
  {
    label: t('system.views.dataPermission.title.permissionScope.DATA_DEPT'),
    value: 'DATA_DEPT',
  },
  {
    label: t(
      'system.views.dataPermission.title.permissionScope.DATA_DEPT_AND_CHILD',
    ),
    value: 'DATA_DEPT_AND_CHILD',
  },
  {
    label: t('system.views.dataPermission.title.permissionScope.DATA_PERSONAL'),
    value: 'DATA_PERSONAL',
  },
  {
    label: t('system.views.dataPermission.title.permissionScope.DATA_CUSTOM'),
    value: 'DATA_CUSTOM',
  },
];
