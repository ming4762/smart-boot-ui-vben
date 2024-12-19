import { ApiServiceEnum, requestClient } from '#/api/request';

interface FeedBackData {
  exceptionNoList: number[];
  feedBackContent: string;
}

enum Api {
  feedback = '/sys/exception/feedback',
  getAuthProperties = '/public/auth/getAuthProperties',
  getSystemProperties = 'public/system/getSystemProperties',
}

/**
 * 反馈异常
 * @param data
 */
export const feedbackExceptionApi = (data: FeedBackData) => {
  return requestClient.post(
    Api.feedback,
    {
      idList: data.exceptionNoList,
      feedbackMessage: data.feedBackContent,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 获取认证参数
 */
export const getAuthPropertiesApi = () => {
  return requestClient.post<Record<string, any>>(
    Api.getAuthProperties,
    {},
    {
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
};

/**
 * 获取系统参数
 */
export const getSystemPropertiesApi = () => {
  return requestClient.post<Record<string, any>>(
    Api.getSystemProperties,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
