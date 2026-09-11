export type WebhookConfigStatus = 'DISABLED' | 'ENABLED';

export type WebhookDeliveryStatus =
  | 'DEAD'
  | 'DELIVERING'
  | 'PENDING'
  | 'RETRY_WAIT'
  | 'SUCCESS';

const CONFIG_STATUS_META: Record<
  WebhookConfigStatus,
  { color: string; label: string }
> = {
  ENABLED: { color: 'success', label: '启用' },
  DISABLED: { color: 'default', label: '停用' },
};

const DELIVERY_STATUS_META: Record<
  WebhookDeliveryStatus,
  { color: string; label: string }
> = {
  PENDING: { color: 'processing', label: '待投递' },
  DELIVERING: { color: 'blue', label: '投递中' },
  RETRY_WAIT: { color: 'warning', label: '等待重试' },
  SUCCESS: { color: 'success', label: '成功' },
  DEAD: { color: 'error', label: '终止' },
};

export const getWebhookConfigStatusMeta = (status?: string) =>
  CONFIG_STATUS_META[status as WebhookConfigStatus] ?? {
    color: 'default',
    label: status || '-',
  };

export const getWebhookDeliveryStatusMeta = (status?: string) =>
  DELIVERY_STATUS_META[status as WebhookDeliveryStatus] ?? {
    color: 'default',
    label: status || '-',
  };

export const getWebhookConfigStatusOptions = () =>
  Object.entries(CONFIG_STATUS_META).map(([value, meta]) => ({
    label: meta.label,
    value,
  }));

export const getWebhookDeliveryStatusOptions = () =>
  Object.entries(DELIVERY_STATUS_META).map(([value, meta]) => ({
    label: meta.label,
    value,
  }));
