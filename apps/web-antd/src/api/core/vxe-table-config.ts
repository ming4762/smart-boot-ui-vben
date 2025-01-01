import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  listCurrentUserConfig = 'sys/configStorage/listCurrentUserConfig',
  saveVxeConfig = 'sys/configStorage/saveVxeConfig',
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
