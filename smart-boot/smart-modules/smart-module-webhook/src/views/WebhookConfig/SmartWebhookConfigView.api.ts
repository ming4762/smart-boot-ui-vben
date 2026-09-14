import type { Recordable } from '@vben/types';

import type {
  WebhookClient,
  WebhookId,
  WebhookSubscription,
} from '../../types/webhook';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum ClientApi {
  delete = '/webhook/manage/client/batchDeleteById',
  getById = '/webhook/manage/client/getById',
  list = '/webhook/manage/client/list',
  save = '/webhook/manage/client/save',
  setUseYn = '/webhook/manage/client/setUseYn',
  update = '/webhook/manage/client/update',
}

enum SubscriptionApi {
  delete = '/webhook/manage/subscription/batchDeleteById',
  getById = '/webhook/manage/subscription/getById',
  list = '/webhook/manage/subscription/list',
  save = '/webhook/manage/subscription/save',
  update = '/webhook/manage/subscription/update',
}

export const listClientApi = (params: Recordable<any>) =>
  requestClient.post(ClientApi.list, params, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const getClientByIdApi = (id: WebhookId) =>
  requestClient.post<WebhookClient>(ClientApi.getById, id, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const saveClientApi = (model: Partial<WebhookClient>) =>
  requestClient.post(ClientApi.save, model, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const updateClientApi = (model: Partial<WebhookClient>) =>
  requestClient.post(ClientApi.update, model, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const deleteClientApi = (rows: WebhookClient[]) =>
  requestClient.post(
    ClientApi.delete,
    rows.map((item) => item.id),
    { service: ApiServiceEnum.SMART_WEBHOOK },
  );

export const setClientUseYnApi = (rows: WebhookClient[], useYn: boolean) =>
  requestClient.post(
    ClientApi.setUseYn,
    {
      idList: rows.map((item) => item.id),
      useYn,
    },
    { service: ApiServiceEnum.SMART_WEBHOOK },
  );

export const listSubscriptionApi = (params: Recordable<any>) =>
  requestClient.post(SubscriptionApi.list, params, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const getSubscriptionByIdApi = (id: WebhookId) =>
  requestClient.post<WebhookSubscription>(SubscriptionApi.getById, id, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const saveSubscriptionApi = (model: Partial<WebhookSubscription>) =>
  requestClient.post(SubscriptionApi.save, model, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const updateSubscriptionApi = (model: Partial<WebhookSubscription>) =>
  requestClient.post(SubscriptionApi.update, model, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const deleteSubscriptionApi = (rows: WebhookSubscription[]) =>
  requestClient.post(
    SubscriptionApi.delete,
    rows.map((item) => item.id),
    { service: ApiServiceEnum.SMART_WEBHOOK },
  );
