import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { RequestClient } from '../request-client';
import type { UploadFileParams } from '../types';

class FileUploader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async batchUpload(
    url: string,
    params: UploadFileParams,
    config?: AxiosRequestConfig,
  ) {
    const formData = new FormData();
    const file = params.file;
    const uploadFileList = Array.isArray(file) ? file : [file];
    uploadFileList.forEach((item) => {
      const customFilename = item.name || 'file';
      if (item.filename) {
        formData.append(customFilename, item.file, item.filename);
      } else {
        formData.append(customFilename, item.file);
      }
    });
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data[key]);
      });
    }

    return this.client.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  public async upload(
    url: string,
    data: { file: Blob | File } & Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.client.post(url, formData, finalConfig);
  }
}

export { FileUploader };
