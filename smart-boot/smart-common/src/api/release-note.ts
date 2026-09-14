import { ApiServiceEnum, requestClient } from './request';

enum Api {
  hasUnread = '/sys/releaseNote/user/unread',
  list = '/sys/releaseNote/user/list',
  markRead = '/sys/releaseNote/user/markRead',
}

export interface ReleaseNote {
  content: string;
  id: number;
  publishSequence: number;
  publishedTime: string;
  title: string;
  version: string;
}

export const listReleaseNotesApi = () =>
  requestClient.post<ReleaseNote[]>(Api.list, undefined, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });

export const hasUnreadReleaseNotesApi = () =>
  requestClient.post<boolean>(Api.hasUnread, undefined, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });

export const markReleaseNotesReadApi = (publishSequence: number) =>
  requestClient.post(Api.markRead, { publishSequence }, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
