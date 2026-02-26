import { $api } from '~/api';

export const testApi = () => {
  return $api('public/i18n/readFrontI18n', {
    method: 'POST',
    body: {
      locale: 'zh-CN',
    },
  });
};
