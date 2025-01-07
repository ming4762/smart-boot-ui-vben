import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  markAsRead = '/smart/message/messageSend/markAsRead',
}

/**
 * 标记为已读参数
 */
interface MarkAsReadParams {
  // 是否标记全部
  markAll?: boolean;
  // 消息id列表
  messageIdList?: number[];
}

/**
 * 标记为已读
 */
export const markAsReadApi = (params: MarkAsReadParams) => {
  return requestClient.post<boolean>(
    Api.markAsRead,
    {
      markAll: false,
      ...params,
    },
    {
      service: ApiServiceEnum.SMART_MESSAGE,
    },
  );
};
