import type { Recordable } from '@vben/types';

import type {
  WebhookDelivery,
  WebhookEvent,
  WebhookId,
} from '../../types/webhook';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum EventApi {
  getById = '/webhook/manage/event/getById',
  list = '/webhook/manage/event/list',
}

enum DeliveryApi {
  getById = '/webhook/manage/delivery/getById',
  list = '/webhook/manage/delivery/list',
}

export const listEventApi = (params: Recordable<any>) =>
  requestClient.post(EventApi.list, params, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const getEventByIdApi = (id: WebhookId) =>
  requestClient.post<WebhookEvent>(EventApi.getById, id, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const listDeliveryApi = (params: Recordable<any>) =>
  requestClient.post(DeliveryApi.list, params, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });

export const getDeliveryByIdApi = (id: WebhookId) =>
  requestClient.post<WebhookDelivery>(DeliveryApi.getById, id, {
    service: ApiServiceEnum.SMART_WEBHOOK,
  });
