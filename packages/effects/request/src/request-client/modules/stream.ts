import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

import type { RequestClient } from '../request-client';
import type { StreamRequestOptions } from '../types';

class Stream {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async postStream(
    url: string,
    data?: any,
    requestOptions?: StreamRequestOptions,
  ) {
    return this.stream(url, data, {
      ...requestOptions,
      method: 'POST',
    });
  }

  public async stream(
    url: string,
    data?: any,
    requestOptions?: StreamRequestOptions,
  ) {
    // 获取base url
    const baseUrl = this.client.getApiUrlByService(requestOptions?.service);
    const hasUrlSplit = baseUrl.endsWith('/') && url.startsWith('/');

    const axiosConfig: InternalAxiosRequestConfig = {
      headers: {} as AxiosRequestHeaders,
    };
    const requestInterceptors = this.client.instance.interceptors
      .request as any;
    if (
      requestInterceptors.handlers &&
      requestInterceptors.handlers.length > 0
    ) {
      for (const handler of requestInterceptors.handlers) {
        if (handler.fulfilled) {
          await handler.fulfilled(axiosConfig);
        }
      }
    }

    const requestInit: RequestInit = {
      ...requestOptions,
      body: data,
      headers: {
        ...(axiosConfig.headers as Record<string, string>),
        ...requestOptions?.headers,
      },
    };
    const response = await fetch(
      `${baseUrl}${hasUrlSplit ? '' : '/'}${url}`,
      requestInit,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let hasEnd = false;
    if (!reader) {
      throw new Error('No reader');
    }
    while (!hasEnd) {
      const { done, value } = await reader.read();
      if (done) {
        hasEnd = true;
        requestOptions?.onEnd?.();
        break;
      }
      const content = decoder.decode(value, { stream: true });
      requestOptions?.onMessage?.(content);
    }
  }
}

export { Stream };
