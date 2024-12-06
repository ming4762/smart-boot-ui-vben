import { $t as t } from '@vben/locales';

import { createErrorModal, successMessage } from '#/utils';

import { testConnectedApi } from './DatabaseListView.api';

export const handleTestConnected = async (
  row: any,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const result = await testConnectedApi(row.id);
    if (result.result === true) {
      successMessage(t('smart.code.views.database.message.connectSuccess'));
    } else {
      createErrorModal({
        title: t('smart.code.views.database.message.connectFail'),
        content: result.message,
      });
    }
  } finally {
    setLoading(false);
  }
};
