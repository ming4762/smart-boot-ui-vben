import { ApiServiceEnum, requestClient } from '#/api/request';

interface FeedBackData {
  exceptionNoList: number[];
  feedBackContent: string;
}

enum Api {
  feedback = '/sys/exception/feedback',
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
