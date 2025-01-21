/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { ErrorMessageMode, RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { useAuthStore } from '#/store';
import { createErrorModal, errorMessage } from '#/utils';

import { refreshTokenApi } from './core';

const { apiURL, apiMode } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
    isStandalone: apiMode === 'standalone',
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // response数据解构
  // client.addResponseInterceptor<HttpResponse>({
  //   fulfilled: (response) => {
  //     const { data: responseData, status } = response;
  //
  //     const { code, data } = responseData;
  //     if (status >= 200 && status < 400 && code === 200) {
  //       return data;
  //     }
  //     // eslint-disable-next-line prefer-promise-reject-errors
  //     return Promise.reject({
  //       config: response.config,
  //       isSystemError: true,
  //       response,
  //     });
  //   },
  // });
  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 200,
    }),
  );

  // token过期的处理（基于刷新token）
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // token过期的处理（基于jwt后台过期）
  client.addResponseInterceptor({
    rejected: (error) => {
      const { response } = error;
      // 如果不是 401 错误，直接抛出异常
      if (
        response?.data?.code !== 401 ||
        error.config?.authErrorProcessed === false
      ) {
        throw error;
      }
      const authStore = useAuthStore();
      if (preferences.app.loginExpiredMode === 'modal') {
        authStore.loginExpired(true, false);
      } else {
        errorMessage(t('ui.fallback.http.unauthorized'));
        authStore.logout();
      }
      return Promise.reject(Object.assign(error, { isProcessed: true }));
    },
  });

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      if (error.isProcessed) {
        return;
      }
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const responseData = error?.response?.data ?? {};
      const errorMessageStr =
        responseData?.error ?? responseData?.message ?? msg;
      // 如果没有错误信息，则会根据状态码进行提示
      const errorMessageMode = error?.config?.errorMessageMode as
        | ErrorMessageMode
        | undefined;
      if (errorMessageMode === 'modal') {
        createErrorModal({
          content: errorMessageStr,
        });
      } else if (!errorMessageMode || errorMessageMode === 'message') {
        errorMessage(errorMessageStr);
      } else {
        console.error(errorMessageStr);
      }
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });

export { ApiServiceEnum } from '@vben/constants';
