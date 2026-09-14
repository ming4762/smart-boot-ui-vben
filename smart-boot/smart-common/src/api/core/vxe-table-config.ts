import { ApiServiceEnum, requestClient } from '../request';

enum Api {
  listCurrentUserConfig = 'sys/userPreference/listCurrentUserConfig',
  saveVxeConfig = 'sys/userPreference/saveVxeConfig',
}

/**
 * 查询当前用户配置
 */
export const listCurrentUserVxeConfigApi = () => {
  return requestClient.post<any[]>(
    Api.listCurrentUserConfig,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
      errorMessageMode: 'none',
    },
  );
};

/**
 * 保存用户配置
 * @param configKey 配置key
 * @param configValue 配置值
 */
export const saveVxeConfigApi = (configKey: string, configValue: string) => {
  return requestClient.post(
    Api.saveVxeConfig,
    {
      configKey,
      configValue,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
