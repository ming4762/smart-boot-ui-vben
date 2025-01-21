import type { AxiosInstance, AxiosResponse } from 'axios';

import type { RequestClientConfig, RequestClientOptions } from './types';

import { bindMethods, merge } from '@vben/utils';

import axios from 'axios';

import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { Stream } from './modules/stream';
import { FileUploader } from './modules/uploader';

class RequestClient {
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];

  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  public batchUpload: FileUploader['batchUpload'];

  public download: FileDownloader['download'];
  // 是否正在刷新token
  public isRefreshing = false;
  public postStream: Stream['postStream'];

  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = [];
  public upload: FileUploader['upload'];

  private baseUrl: string = '';
  private readonly instance: AxiosInstance;
  // 是否单体架构
  private isStandalone = true;

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: RequestClientOptions = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      responseReturn: 'raw',
      // 默认超时时间
      timeout: 10_000,
    };
    const { ...axiosConfig } = options;
    const requestConfig = merge(axiosConfig, defaultConfig);
    this.instance = axios.create(requestConfig);
    this.isStandalone = options.isStandalone === true;
    this.baseUrl = requestConfig.baseURL ?? '';

    bindMethods(this);

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor =
      interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor =
      interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 实例化文件上传器
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    this.batchUpload = fileUploader.batchUpload.bind(fileUploader);
    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
    // 实例化流请求功能
    const stream = new Stream(this);
    this.postStream = stream.postStream.bind(stream);

    // 微服务模式下，添加请求拦截器，用于添加服务名
    this.addRequestInterceptor({
      fulfilled: (config) => {
        if (this.isStandalone || !(config as any).service) {
          return config;
        }
        let spi = '';
        if (!config.url?.startsWith('/')) {
          spi = '/';
        }
        config.url = `${(config as any).service}${spi}${config.url}`;
        return config;
      },
    });
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(
    url: string,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   */
  public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * 获取后台API请求地址
   * @param service
   */
  public getApiUrlByService(service?: string): string {
    if (!this.isStandalone && service) {
      return `${this.baseUrl}/${service}`;
    }
    return this.baseUrl;
  }

  /**
   * POST请求方法
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * POST Form请求方法
   */
  public postForm<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    const headers = config?.headers || {};
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    return this.request<T>(url, { ...config, data, headers, method: 'POST' });
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(
    url: string,
    config: RequestClientConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
      });
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
}

export { RequestClient };
