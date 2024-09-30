import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: InternalAxiosRequestConfig,
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: AxiosResponse<T>,
  ) => AxiosResponse | Promise<AxiosResponse>;
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
}

/**
 * 错误信息警告方式
 */
type ErrorMessageMode = 'message' | 'modal' | 'none' | undefined;

enum ApiServiceEnum {
  NONE = '',
  SMART_AUTH = 'smart-auth',
  // 代码生成器
  SMART_CODE = 'smart-code',
  SMART_FILE = 'smart-file',
  // 消息服务，包括短信等
  SMART_MESSAGE = 'smart-message',
  SMART_SYSTEM = 'smart-system',
}

type ApiService = ApiServiceEnum;

interface RequestOptions extends AxiosRequestConfig {
  // 错误信息警告方式
  errorMessageMode?: ErrorMessageMode;
  service?: ApiService;
}

export { ApiServiceEnum };

export type {
  ErrorMessageMode,
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestOptions,
  ResponseInterceptorConfig,
};
