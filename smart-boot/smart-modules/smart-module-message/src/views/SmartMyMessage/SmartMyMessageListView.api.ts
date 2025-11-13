import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  list = '/smart/message/messageSend/pageCurrentUserMessage',
}

export const pageCurrentUserMessageApi = (data: any) => {
  return requestClient.post(Api.list, data, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};
