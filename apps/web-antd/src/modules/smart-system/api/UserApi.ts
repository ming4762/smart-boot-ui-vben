import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  deleteUserById = '/sys/user/batchDeleteByIdWithTenant',
}

/**
 * 通过用户ID批量删除用户
 * @param tenantId
 * @param userIds
 */
export const deleteUserByIdApi = (
  tenantId: null | number | undefined,
  userIds: number[],
) => {
  return requestClient.post(
    Api.deleteUserById,
    {
      tenantId,
      userIdList: userIds,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
