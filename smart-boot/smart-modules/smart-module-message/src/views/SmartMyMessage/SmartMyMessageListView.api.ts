import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  list = '/smart/message/messageSend/pageCurrentUserMessage',
}

export const pageCurrentUserMessageApi = (data: any) => {
  return requestClient.post(Api.list, data, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};
