import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type RequestResponse<T = any> = AxiosResponse<T>;

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & {
  isStandalone?: boolean;
};

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
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestOptions,
  RequestResponse,
  ResponseInterceptorConfig,
  StreamRequestOptions,
  UploadFileParams,
};
