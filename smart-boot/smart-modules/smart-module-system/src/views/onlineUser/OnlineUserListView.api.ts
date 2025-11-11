import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  listOnlineUser = 'auth/listOnlineUser',
  offline = 'auth/offline',
}

export const listOnlineUserApi = (params: any) => {
  return requestClient.post(Api.listOnlineUser, params, {
    service: ApiServiceEnum.SMART_AUTH,
  });
};

export const offlineApi = (username?: string, token?: string) => {
  return requestClient.post(
    Api.offline,
    { username, token },
    {
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
};
