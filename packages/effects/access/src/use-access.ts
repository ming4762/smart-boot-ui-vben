import type { SmartAuthType } from '@vben/types';

import { computed } from 'vue';

import { preferences, updatePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { isFunction, isString } from '@vben/utils';

function useAccess() {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const accessMode = computed(() => {
    return preferences.app.accessMode;
  });

  /**
   * 无权限模式
   */
  const accessNoAuthMode = computed(() => {
    return preferences.app.accessNoAuthMode;
  });

  /**
   * 基于角色判断是否有权限
   * @description: Determine whether there is permission，The role is judged by the user's role
   * @param roles
   */
  function hasAccessByRoles(roles: string[]) {
    const userRoleSet = new Set(userStore.userRoles);
    const roleCodesSet = new Set();
    userRoleSet.forEach((item) => roleCodesSet.add(item.roleCode));
    const intersection = roles.filter((item) => roleCodesSet.has(item));
    return intersection.length > 0;
  }

  /**
   * 基于权限码判断是否有权限
   * @description: Determine whether there is permission，The permission code is judged by the user's permission code
   * @param codes
   */
  function hasAccessByCodes(codes: string[]) {
    const userCodesSet = new Set(accessStore.accessCodes);

    const intersection = codes.filter((item) => userCodesSet.has(item));
    return intersection.length > 0;
  }

  /**
   * 根据权限判断是否有权限
   * @param auth
   */
  function hasAccessByAuth(auth?: SmartAuthType) {
    if (!auth) {
      return true;
    }
    if (isFunction(auth)) {
      return auth();
    }
    if (isString(auth)) {
      return hasAccessByCodes([auth]);
    }
    const { multipleMode, permission } = auth;
    const codes = isString(permission) ? [permission] : permission;
    return multipleMode === 'or'
      ? codes.some((item) => hasAccessByCodes([item]))
      : codes.every((item) => hasAccessByCodes([item]));
  }

  async function toggleAccessMode() {
    updatePreferences({
      app: {
        accessMode:
          preferences.app.accessMode === 'frontend' ? 'backend' : 'frontend',
      },
    });
  }

  return {
    accessMode,
    hasAccessByCodes,
    hasAccessByRoles,
    hasAccessByAuth,
    toggleAccessMode,
    accessNoAuthMode,
  };
}

export { useAccess };
