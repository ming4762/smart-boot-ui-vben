import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type ExtendOptions = {
  // 是否是单体架构
  isStandalone?: boolean;
  /** 响应数据的返回方式。
   * raw: 原始的AxiosResponse，包括headers、status等。
   * body: 返回响应数据的BODY部分。
   * data: 解构响应的BODY数据，只返回其中的data节点数据。
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions;

type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig<any>)
    | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: RequestResponse<T>,
  ) => Promise<RequestResponse> | RequestResponse;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

interface HttpResponse<T = any> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
  /**
   * 异常编号
   */
  exceptionNo?: number;
}

/**
 * 错误信息警告方式
 */
type ErrorMessageMode = 'message' | 'modal' | 'none' | undefined;

interface RequestOptions extends AxiosRequestConfig {
  // 错误信息警告方式
  errorMessageMode?: ErrorMessageMode;
  service?: string;
  // 是否处理认证错误
  authErrorProcessed?: boolean;
}

interface StreamRequestOptions extends RequestInit {
  service?: string;
  onMessage?: (message: string) => void;
  onEnd?: () => void;
}

interface UploadFileItemParams {
  // File parameter interface field name
  name?: string;
  // file name
  file: Blob | File;
  // file name
  filename?: string;
}

interface UploadFileParams {
  data?: any;
  file: UploadFileItemParams | UploadFileItemParams[];
  filename?: string;
  [key: string]: any;
}

export type {
  ErrorMessageMode,
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestOptions,
  RequestResponse,
  ResponseInterceptorConfig,
  StreamRequestOptions,
  UploadFileParams,
};
