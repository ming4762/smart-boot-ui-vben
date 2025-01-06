import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  readFrontI18n = 'public/i18n/readFrontI18n',
}

/**
 * 读取前台国际化信息
 */
export const readFrontI18nApi = async () => {
  try {
    return await requestClient.post(
      Api.readFrontI18n,
      {},
      {
        service: ApiServiceEnum.SMART_SYSTEM,
        errorMessageMode: 'none',
      },
    );
  } catch (error) {
    console.error(error);
    return {};
  }
};
