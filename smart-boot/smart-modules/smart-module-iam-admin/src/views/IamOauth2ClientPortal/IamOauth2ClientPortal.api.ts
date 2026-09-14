import { ApiServiceEnum, requestClient } from '@smart/common/api';

export interface IamOauth2ClientPortalItem {
  clientName: string;
  id: number;
  initiateLoginUri: string;
  remark?: string;
}

export const listPortalClientApi = () => {
  return requestClient.post<IamOauth2ClientPortalItem[]>(
    'iam/oauth2/client/portal',
    {},
    {
      service: ApiServiceEnum.SMART_SSO_SERVER,
    },
  );
};
