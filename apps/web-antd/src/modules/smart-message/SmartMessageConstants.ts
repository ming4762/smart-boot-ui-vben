import { $t as t } from '@vben/locales';

export const getMessageTypeEnum = () => {
  return [
    {
      label: t('smart.message.systemMessage.form.messageType.announcement'),
      value: 'ANNOUNCEMENT',
    },
    {
      label: t('smart.message.systemMessage.form.messageType.systemMessage'),
      value: 'SYSTEM_MESSAGE',
    },
  ];
};

export const getMessagePriorityEnum = () => {
  return [
    {
      label: t('smart.message.systemMessage.form.messagePriority.LOW'),
      value: 'L',
      color: 'green',
    },
    {
      label: t('smart.message.systemMessage.form.messagePriority.MIDDLE'),
      value: 'M',
      color: 'orange',
    },
    {
      label: t('smart.message.systemMessage.form.messagePriority.HIGH'),
      value: 'H',
      color: 'pink',
    },
  ];
};
