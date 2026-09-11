import type {
  WebhookConfigStatus,
  WebhookDeliveryStatus,
} from '../SmartWebhookConstants';

export type WebhookId = number | string;

interface WebhookAuditModel {
  createBy?: WebhookId;
  createTime?: string;
  updateBy?: WebhookId;
  updateTime?: string;
}

export interface WebhookClient extends WebhookAuditModel {
  clientCode: string;
  clientName: string;
  description?: string;
  id: WebhookId;
  useYn: boolean;
}

export interface WebhookSubscription extends WebhookAuditModel {
  callbackUrl: string;
  clientId: WebhookId;
  eventType: string;
  id: WebhookId;
  status: WebhookConfigStatus;
}

export interface WebhookEvent {
  createTime?: string;
  eventId: string;
  eventName: string;
  eventType: string;
  eventVersion?: string;
  id: WebhookId;
  occurredAt?: string;
  payload?: string;
  source?: string;
  tenantId?: WebhookId;
}

export interface WebhookDelivery {
  attemptCount: number;
  callbackUrl: string;
  clientId: WebhookId;
  createTime?: string;
  eventId: string;
  id: WebhookId;
  lastError?: string;
  lastHttpStatus?: number;
  lockedAt?: string;
  lockedBy?: string;
  nextRetryAt?: string;
  responseBody?: string;
  status: WebhookDeliveryStatus;
  subscriptionId: WebhookId;
  successTime?: string;
  updateTime?: string;
  webhookEventId: WebhookId;
}
