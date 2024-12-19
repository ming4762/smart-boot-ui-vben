import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';
import { useAuthStore } from '#/store';

enum Api {
  delete = 'smart/file/batchDeleteFile',
  download = '/public/file/download/',
  getById = 'smart/file/getById',
  list = 'smart/file/list',
  uploadFile = 'smart/file/upload',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_FILE,
  });
};

export const uploadFileApi = (data: any, file: File) => {
  return requestClient.upload(
    Api.uploadFile,
    {
      ...data,
      file,
    },
    { service: ApiServiceEnum.SMART_FILE },
  );
};

export const deleteApi = (removeRecords: Recordable<any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.fileId),
    {
      service: ApiServiceEnum.SMART_FILE,
    },
  );
};

export const getByIdApi = (model: Recordable<any>) => {
  return requestClient.post(Api.getById, model.fileId, {
    service: ApiServiceEnum.SMART_FILE,
  });
};

export const downloadApi = async (id: number) => {
  const { applyTempToken } = useAuthStore();
  let url = `${requestClient.getApiUrlByService(ApiServiceEnum.SMART_FILE)}/${Api.download}${id}`;

  // 申请临时token
  const tempToken = await applyTempToken('smart:file:download');
  url = `${url}?access-token=${tempToken}`;
  window.open(url);
};
