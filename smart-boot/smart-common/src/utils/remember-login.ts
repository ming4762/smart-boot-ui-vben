const REMEMBER_LOGIN_KEY = `REMEMBER_LOGIN_ENABLED_${location.hostname}`;

/**
 * 当前浏览器是否允许使用 Remember-Me 恢复登录状态。
 */
export function isRememberLoginEnabled(): boolean {
  return localStorage.getItem(REMEMBER_LOGIN_KEY) === 'true';
}

/**
 * 记录用户最近一次登录是否选择保持登录。
 *
 * @param enabled 是否保持登录
 */
export function setRememberLoginEnabled(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem(REMEMBER_LOGIN_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_LOGIN_KEY);
  }
}
