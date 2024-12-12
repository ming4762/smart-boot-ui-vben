import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  list = '/smart/message/messageSend/pageCurrentUserMessage',
  markAsRead = '/smart/message/messageSend/markAsRead',
}

export const pageCurrentUserMessageApi = (data: any) => {
  return requestClient.post(Api.list, data, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

export const markAsReadApi = (data: any) => {
  return requestClient.post(Api.markAsRead, data, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};
